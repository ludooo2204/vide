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
  const [value, setValue] = useState(1);
  const [valueString, setValueString] = useState('');
  //   const [debit, setDebit] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedIndexCapteur, setIndexCapteur] = useState(1);
  const [selectedIndexGaz, setIndexGaz] = useState(1);
  const [selectedIndexType, setIndexType] = useState(0);
  const typeGaz = ['H2', 'Argon', 'Air'];
  const coefTypeGaz = [1.01, 1.45, 1.00];
  const type = ['L/min', 'kg/h'];

  let dataDEB003_100 = [
    [0.52, 9.8477],
    [1.027, 19.5239],
    [2.017, 38.1004],
    [3.01, 57.545],
    [4.027, 77.6608],
    [4.907, 96.5019],
  ];
  let dataDEB003_30 = [
    [0.448, 3.0341],
    [0.994, 6.3617],
    [1.999, 12.0553],
    [3.047, 17.797],
    [4.073, 23.4518],
    [4.969, 28.6705],
  ];
  let dataDEB003_300 = [
    [0.509, 26.95813],
    [1.0057, 54.50487],
    [1.998, 110.5131],
    [2.9853, 172.3644],
    [4.0273, 240.84813],
    [4.9953, 303.55744],
  ];
  const COEF_ARGON = 1.45;
  const COEF_AIR = 1;
  const COEF_H2 = 1.45;
  const capteurs = ['DEB003-30', 'DEB003-100', 'DEB003-300'];
  const dataCapteurs = [dataDEB003_30, dataDEB003_100,dataDEB003_300];
  console.log("data",selectedIndexCapteur)
  const result = regression.polynomial(dataCapteurs[selectedIndexCapteur], {
    order: 4,
    precision: 12,
  });
  // console.log(result);
  // console.log(result.predict(0.52));
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

  console.log("value");
  console.log(value);
  console.log(coefTypeGaz[selectedIndexGaz]);
  const debit =
    Math.round(result.predict(value)[1] *
      coefTypeGaz[selectedIndexGaz] *
      100) /
    100;
  //   const debit= result.predict(value)
  console.log("debit = ",debit)
  console.log("debit = ",result.predict(value)[1])

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
          <ButtonGroup
            onPress={updateIndexGaz}
            selectedIndex={selectedIndexGaz}
            buttons={typeGaz}
            containerStyle={{height: 40}}
          />
          <ButtonGroup
            onPress={updateIndexType}
            selectedIndex={selectedIndexType}
            buttons={type}
            containerStyle={{height: 40}}
          />
          <Divider style={{backgroundColor: 'blue', marginVertical: 10}} />
          {/* <Text>TOTOO</Text> */}
        </View>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 50,
              alignSelf: 'auto',
              //   marginTop:20
            }}>{`${Math.round(debit * 1000) / 1000} ${
            type[selectedIndexType]
          }`}</Text>
          <Text
            style={{
              fontSize: 30,
              marginTop: 20,
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
            <Input
              containerStyle={{flex: 3}}
              style={{fontSize:25,marginLeft:10}}
              placeholder="Saisir Tension"
              leftIcon={{type: 'font-awesome', name: 'tachometer', size: 40}}
              onChangeText={value => handleInput(value)}
              value={valueString}
              errorStyle={{color: 'red'}}
              errorMessage={
                value!=0 && (value > dataCapteurs[selectedIndexCapteur][5][0] || value < dataCapteurs[selectedIndexCapteur][0][0])
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
              maximumValue={dataCapteurs[selectedIndexCapteur][5][0]}
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
