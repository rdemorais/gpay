import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  GooglePay,
  RequestDataType,
  AllowedCardNetworkType,
  AllowedCardAuthMethodsType,
} from 'react-native-google-pay';

import axios from 'axios'

const allowedCardNetworks: AllowedCardNetworkType[] = ['VISA', 'MASTERCARD'];
const allowedCardAuthMethods: AllowedCardAuthMethodsType[] = [
  'PAN_ONLY',
  'CRYPTOGRAM_3DS',
];

const gatewayRequestData: RequestDataType = {
  cardPaymentMethod: {
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY',
      gateway: 'cielo',
      gatewayMerchantId: '<MERCHANT_ID>',
    },
    allowedCardNetworks,
    allowedCardAuthMethods,
  },
  transaction: {
    totalPrice: '10',
    totalPriceStatus: 'FINAL',
    currencyCode: 'BRL',
  },
  merchantName: 'Cielo',
};

const directRequestData: RequestDataType = {
  cardPaymentMethod: {
    tokenizationSpecification: {
      type: 'DIRECT',
      publicKey:
        'BOdoXP+9Aq473SnGwg3JU1aiNpsd9vH2ognq4PtDtlLGa3Kj8TPf+jaQNPyDSkh3JUhiS0KyrrlWhAgNZKHYF2Y=',
    },
    allowedCardNetworks,
    allowedCardAuthMethods,
  },
  transaction: {
    totalPrice: '123',
    totalPriceStatus: 'FINAL',
    currencyCode: 'RUB',
  },
  merchantName: 'Example Merchant',
};

const stripeRequestData: RequestDataType = {
  cardPaymentMethod: {
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY',
      gateway: 'stripe',
      gatewayMerchantId: '',
      stripe: {
        publishableKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
        version: '2018-11-08',
      },
    },
    allowedCardNetworks,
    allowedCardAuthMethods,
  },
  transaction: {
    totalPrice: '123',
    totalPriceStatus: 'FINAL',
    currencyCode: 'RUB',
  },
  merchantName: 'Example Merchant',
};

export default class App extends Component {
  componentDidMount() {
    // Set the environment before the payment request
    if (Platform.OS === 'android') {
      GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);
    }
  }

  payWithGooglePay = (requestData: RequestDataType) => {
    // Check if Google Pay is available
    GooglePay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods).then(
      ready => {
        if (ready) {
          // Request payment token
          GooglePay.requestPayment(requestData)
            .then(this.handleSuccess)
            .catch(this.handleError);
        }
      },
    );
  };

  handleSuccess = (token: string) => {
    // Send a token to your payment gateway
    const tokenJson = JSON.parse(token)
    const payload = {
      "MerchantOrderId": "<>",
      "Customer": {
        nome: "Rafael de Morais"
      },
      "Payment": {
        "Type": "CreditCard",
        "Amount": 1000,
        "Installments": 1,
        "Wallet": {
          "Type": "AndroidPay",
          "WalletKey": tokenJson.signedMessage,
          "AdditionalData": {
            "Signature": tokenJson.signature
          }
        }
      }
    }

    console.log(payload)
    
    axios.post('https://apisandbox.cieloecommerce.cielo.com.br/1/sales', payload, {
      headers: {
        merchantid: 'MERCHANT_ID',
        merchantkey: 'MERCHANT_KEY',
        "content-type": "application/json"
      }
    }).then( res => {
      console.tron.log(res)
    }).catch(err => {
      console.tron.log(err)
    })
  };

  handleError = (error: any) =>
    Alert.alert('Error', `${error.code}\n${error.message}`);

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Teste RN Cielo</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.payWithGooglePay(gatewayRequestData)}>
          <Text style={styles.buttonText}>Cielo</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[styles.button, styles.direct]}
          onPress={() => this.payWithGooglePay(directRequestData)}>
          <Text style={styles.buttonText}>DIRECT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.stripe]}
          onPress={() => this.payWithGooglePay(stripeRequestData)}>
          <Text style={styles.buttonText}>Stripe</Text>
        </TouchableOpacity> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  welcome: {
    fontSize: 18,
    color: '#222',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#34a853',
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 24,
    justifyContent: 'center',
    marginVertical: 8,
  },
  direct: {
    backgroundColor: '#db7d35',
  },
  stripe: {
    backgroundColor: '#556cd6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});