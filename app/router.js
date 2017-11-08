import React, { PureComponent } from 'react'
import { BackHandler, Animated, Easing, ToastAndroid } from 'react-native'
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom,
  addNavigationHelpers,
  NavigationActions,
} from 'react-navigation'
import { connect } from 'react-redux'
import theme from './utils/theme'

import Login from './containers/Login'
import Home from './containers/Home'
import Account from './containers/Account'
import Detail from './containers/Detail'

const HomeNavigator = TabNavigator(
  {
    Home: { screen: Home },
    Account: { screen: Account },
  },
  {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    lazyLoad: true,
    tabBarOptions: {
      activeTintColor: theme.color,  // 文字和图片选中颜色
      inactiveTintColor: '#999',     // 文字和图片默认颜色
      // activeBackgroundColor
      // inactiveBackgroundColor
      showLabel: true,
      showIcon: true,                // android 默认不显示 icon, 需要设置为 true 才会显示
      indicatorStyle: { height: 0 }, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了， 不知道还有没有其它方法隐藏？？？
      style: {
        backgroundColor: '#fff',     // TabBar 背景色
      },
      labelStyle: {                  // 文字样式
        fontSize: 12,
      },
    },
  }
)

const MainNavigator = StackNavigator(
  {
    HomeNavigator: { screen: HomeNavigator },
    Detail: { screen: Detail },
  },
  {
    mode: 'card',
    headerMode: 'float',
    navigationOptions: {
      headerStyle: {
        // backgroundColor: theme.color,
        // justifyContent: 'center',
      },
      headerTitleStyle: {
        // color: '#fff',
      },
      gesturesEnabled: false,
    },
  }
)

const AppNavigator = StackNavigator(
  {
    Main: { screen: MainNavigator },
    Login: { screen: Login },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps
        const { index } = scene

        const height = layout.initHeight
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        })

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        })

        return { opacity, transform: [{ translateY }] }
      },
    }),
  }
)

function getCurrentScreen(navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getCurrentScreen(route)
  }
  return route.routeName
}

@connect(({ router }) => ({ router }))
class Router extends PureComponent {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandle)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandle)
  }

  backHandle = () => {
    const currentScreen = getCurrentScreen(this.props.router)
    if (currentScreen === 'Login') {
      return true
    }
    if (currentScreen !== 'Home') {
      this.props.dispatch(NavigationActions.back())       // 返回上个页面
      return true
    }
    if (currentScreen === 'Home') {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        // 最近2秒内按过back键，可以退出应用
        BackHandler.exitApp()
        return false
      }
      this.lastBackPressed = Date.now()
      ToastAndroid.showWithGravity('再按一次退出应用', ToastAndroid.SHORT, ToastAndroid.CENTER)
      return true
    }
    return false     // 执行默认返回
  }

  render() {
    const { dispatch, router } = this.props
    const navigation = addNavigationHelpers({ dispatch, state: router })
    return <AppNavigator navigation={navigation} />
  }
}

export function routerReducer(state, action = {}) {
  return AppNavigator.router.getStateForAction(action, state)
}

export default Router
