import React, { Component } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { Button, WhiteSpace, WingBlank } from 'antd-mobile'

import { NavigationActions } from '../utils'

@connect()
class Home extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarLabel: 'Home',
    headerRight:
      <View style={{flexDirection:'row'}}>
        <Text style={{marginRight: 10}}>more</Text>
      </View>,
    tabBarIcon: ({ focused, tintColor }) =>
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/house.png')}
      />,
  }

  gotoDetail = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Detail' }))
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<Button title="Goto Detail" onPress={this.gotoDetail} />*/}
        <WingBlank>
          <WhiteSpace />
          <Button type="primary">primary</Button>
          <WhiteSpace />
        </WingBlank>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 32,
    height: 32,
  },
})

export default Home
