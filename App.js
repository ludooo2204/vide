/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  FlatList,
  Text,
  useColorScheme,
  View,
  Animated,
} from 'react-native';
import regression from './helpers/regression';
import {
  CheckBox,
  Input,
  Button,
  Slider,
  ButtonGroup,
  Divider,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const App = () => {
  const [checked, toggleChecked] = useState(true);
  const [placeholder, setPlaceholder] = useState('Saisir tension');
  const [value, setValue] = useState(5);
  const [valueString, setValueString] = useState('');
  //   const [debit, setDebit] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedIndexCapteur, setIndexCapteur] = useState(1);
  const [selectedIndexGaz, setIndexGaz] = useState(1);
  const [selectedIndexType, setIndexType] = useState(0);

  let PIRANI = [
    [2.148, 1.3e-3, 24.5],
    [2.643, 4.79e-3, 11.6],
    [3.009, 1e-2, 10.2],
    [3.963, 5.02e-2, 8.2],
    [4.564, 9.98e-2, 7.2],
    [5.751, 4.93e-1, 5.9],
    [6.393, 9.87e-1, 5.9],
  ];
  let WRG = [
    [4.469, 7.84e-6, 21.6],
    [4.891, 2.96e-5, 19],
    [5.056, 6.46e-5, 18],
    [5.113, 9.8e-5, 17.7],
    [5.458, 3.17e-4, 16.6],
    [5.705, 8.05e-4, 16.1],
    [5.73, 9.85e-4, 16.1],
  ];
  let PiraniLog = [...PIRANI];
  PIRANI.date = '08/11/2021';
  PIRANI.NumRapport = 'FR214513507';
  WRG.date = '08/11/2021';
  WRG.NumRapport = 'FR214513505';

  for (const iterator of PiraniLog) {
    iterator[1] = Math.log10(iterator[1]);
  }
  let WrgLog = [...WRG];
  for (const iterator of WrgLog) {
    iterator[1] = Math.log10(iterator[1]);
  }
  const capteurs = ['Pirani', 'Wrg'];
  const dataCapteurs = [PiraniLog, WrgLog];
  let PiraniIncertitude = [];
  for (const iterator of PIRANI) {
    PiraniIncertitude.push([iterator[0], iterator[2]]);
  }
  let WrgIncertitude = [];
  for (const iterator of WRG) {
    WrgIncertitude.push([iterator[0], iterator[2]]);
  }
  const dataIncertitude = [PiraniIncertitude, WrgIncertitude];
  const dataEtalonnage = [
    [PIRANI.NumRapport, PIRANI.date],
    [WRG.NumRapport, WRG.date],
  ];
  console.log('PiraniIncertitude');
  console.log(PiraniIncertitude);
  console.log('WrgLog');
  console.log(WrgLog);
  console.log('dataCapteurs[selectedIndexCapteur]');
  console.log(dataCapteurs[selectedIndexCapteur]);

  const result = regression.polynomial(dataCapteurs[selectedIndexCapteur], {
    order: 4,
    precision: 12,
  });
  const resultIncertitude = regression.polynomial(
    dataIncertitude[selectedIndexCapteur],
    {
      order: 4,
      precision: 12,
    },
  );
  console.log(result);
  console.log(resultIncertitude);

  //   console.log(typeof(result.predict(0.52)[1]));

  const updateIndexCapteur = index => {
    setIndexCapteur(index);
  };
  const updateIndexGaz = index => {
    setIndexGaz(index);
  };
  const updateIndexType = index => {
    console.log('index');
    console.log(index);
    setIndexType(index);
  };

  console.log('value');
  console.log(value);

  const debit = result.predict(value)[1];
  const debitIncertitude = resultIncertitude.predict(value)[1];

  //   const debit= result.predict(value)
  console.log('debit = ', debit);
  console.log('debit = ', result.predict(value)[1]);

  const handleInput = input => {
    // setValue
    console.log(input);
    console.log(typeof input);
    setValue(input);
    setValueString(input.toString());
  };
  const raz = () => {
    setValueString('');
    setValue(0);
  };
  return (
    <>
      {/* <Button title="H2" onPress={() => console.log('H2')} />
      <Text>coucou</Text> */}
      <View style={{flex: 1}}>
        <View style={{flex: 2, margin: 10}}>
          {/* <CheckBox center title="Click Here" checked={checked} /> */}

          <ButtonGroup
            onPress={updateIndexCapteur}
            selectedIndex={selectedIndexCapteur}
            buttons={capteurs}
            containerStyle={{height: 40}}
          />

          <Divider style={{backgroundColor: 'blue', marginVertical: 10}} />
          {/* <Text>TOTOO</Text> */}
        </View>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 20,
              alignSelf: 'center',
              marginBottom: 50,
            }}>{`${dataEtalonnage[selectedIndexCapteur][0]} du ${dataEtalonnage[selectedIndexCapteur][1]}`}</Text>

          <Text
            style={{
              fontSize: 50,
              alignSelf: 'auto',
              //   marginTop:20
            }}>{`${Math.pow(10, debit).toExponential(2)} mbar`}</Text>
          <Text
            style={{
              fontSize: 50,
              alignSelf: 'auto',
              //   marginTop:20
            }}>{`Ie = ${Math.round(debitIncertitude * 10) / 10} %`}</Text>
          <Text
            style={{
              fontSize: 30,
              marginTop: 50,
              marginBottom: 100,
            }}>
            {`${Math.round(value * 1000) / 1000} V`}
          </Text>
        </View>
        <View style={{flex: 2, marginTop: 50, margin: 10}}>
          <Divider style={{backgroundColor: 'blue', marginVertical: 10}} />
          <View
            style={{
              flexDirection: 'row',
              flex: 3,
              margin: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {console.log(dataCapteurs[selectedIndexCapteur].length)}
            <Input
              containerStyle={{flex: 3}}
              style={{fontSize: 25, marginLeft: 10}}
              placeholder="Saisir Tension"
              leftIcon={{type: 'font-awesome', name: 'tachometer', size: 40}}
              onChangeText={value => handleInput(value)}
              value={valueString}
              errorStyle={{color: 'red'}}
              errorMessage={
                value != 0 &&
                (value >
                  dataCapteurs[selectedIndexCapteur][
                    dataCapteurs[selectedIndexCapteur].length - 1
                  ][0] ||
                  value < dataCapteurs[selectedIndexCapteur][0][0])
                  ? "VALEUR EN DEHORS DE LA PLAGE D'ETALONNAGE"
                  : null
              }
              keyboardType="number-pad"
            />
            <Button
              // style={{flex:2,fontSize:40}}
              containerStyle={{
                flex: 1,
                alignItems: 'center',
                height: 50,
                // backgroundColor:"grey",
                justifyContent: 'center',
                paddingBottom: 5,
              }}
              title="RAZ"
              onPress={raz}
            />
          </View>

          <View
            style={{
              flex: 1,
              alignItems: 'stretch',
              justifyContent: 'center',
              marginHorizontal: 40,
              marginVertical: 20,
              marginTop: 10,
            }}>
            <Slider
              value={value}
              thumbStyle={{height: 30, width: 20, backgroundColor: '#4287f5'}}
              onValueChange={value1 => setValue(value1)}
              maximumValue={
                dataCapteurs[selectedIndexCapteur][
                  dataCapteurs[selectedIndexCapteur].length - 1
                ][0]
              }
              minimumValue={dataCapteurs[selectedIndexCapteur][0][0]}
              step={0.001}
            />
          </View>

          {/* <Text style={{paddingBottom: 50}}>Value: {value}</Text> */}
        </View>
      </View>
    </>
  );
};

export default App;
