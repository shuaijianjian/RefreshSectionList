/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, Text} from 'react-native';
import RefreshSectionList, {RefreshState} from './src/RefreshSectionList';

import Cell from './Cell'
import testData from './data'

export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
      dataList: [],
      refreshState: RefreshState.Idle,
    }
  }

  componentDidMount() {
    const dataList = this._getTestList(true);
    this.setState({
      dataList
    });
  }

  _onHeaderRefresh = () => {
    this.setState({ 
      refreshState: RefreshState.Failure 
    })

    // 模拟网络请求
    setTimeout(() => {
      // 模拟网络加载失败的情况
      const random = Math.random();
      if (random < 0.3) {
        this.setState({ 
          refreshState: RefreshState.Failure
         })
        return
      }
      //获取测试数据
      const dataList = this._getTestList(true)
      this.setState({
        dataList: dataList,
        refreshState: dataList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle,
      })
    }, 2000)
  }

  _onFooterRefresh = () => { 
    this.setState({ 
      refreshState: RefreshState.FooterRefreshing,
    })
    // 模拟网络请求
    setTimeout(() => {
      // 模拟网络加载失败的情况
      const random = Math.random();
      if (random < 0.2) {
        this.setState({ 
          refreshState: RefreshState.Failure 
        })
        return
      }
      //获取测试数据
      const dataList = this._getTestList(false)
      this.setState({
        dataList: dataList,
        refreshState: dataList.length > 50 ? RefreshState.NoMoreData : RefreshState.Idle,
      })
    }, 2000)
  }

  _getTestList(isReload){
      const newList = testData.map((data, index) => {
      return {
        index,
        imageUrl: data.squareimgurl,
        title: data.mname,
        subtitle: `[${data.range}]${data.title}`,
        price: data.price,
      }
    })
    this.newList = newList;

    const random = Math.random();
    return isReload ? (random < 0.2 ? [] : newList) : [...this.state.dataList, ...newList];
  }
  render() {
    const {dataList =[], refreshState} = this.state;
    const sections = [{key:0, data:dataList},{key:1, data:[{value:'121221212'},{value:'121221212'},{value:'121221212'}]}];
    return (
      <View style={styles.container}>
        <RefreshSectionList
            sections = {sections}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            renderSectionHeader = {this._renderSectionHeader}
            refreshState={refreshState}
            onHeaderRefresh={this._onHeaderRefresh}
            onFooterRefresh={this._onFooterRefresh}

            // 可选
            footerRefreshingText='玩命加载中 >.<'
            footerFailureText='我擦嘞，居然失败了 =.=!'
            footerNoMoreDataText='-我是有底线的-'
            footerEmptyDataText='-好像什么东西都没有-'
          />
      </View>
    );
  }

  _renderItem=({item, section})=>{
    const {key=0} = section;
    if (key === 0) {
      return (<Cell info={item}/>);
    }
    return (<Text>{JSON.stringify(item)}</Text>);
  }


  _renderSectionHeader=({section}) =>{
    const {key=0} = section;
    if (key === 0) {
      return (
        <View style={{backgroundColor:'red', width:500, height:30}}>
          <Text>{JSON.stringify(section.key)}</Text> 
        </View> 
      ) 
    }
    return (
      <View style={{backgroundColor:'yellow', width:500, height:40}}>
        <Text>{JSON.stringify(section.key)}</Text> 
      </View> 
    ) 
  }

  _keyExtractor = (item, index) => {
    return index
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS == 'ios' ? 20 : 0,
  },
  title: {
    fontSize: 18,
    height: 84,
    textAlign: 'center'
  }
});