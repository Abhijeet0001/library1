import React from 'react'
import {Text,View,TouchableOpacity, StyleSheet, CameraRoll, Image, TextInput} from 'react-native'
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as Permission from 'expo-permissions'
import db from '../config'
export default class BookTransaction extends React.Component{
    constructor(){
        super()
        this.state={
            hasCameraPermission:null,
            buttonState:'Normal',
            scanned:'false',
            scandata:'',
            scanBookId:'',
            scanStudentId:'',
            message:''
        }
    }
    getcameraPermissions = async()=>{
        const {status} = await Permission.askAsync(Permission.CAMERA)
        if(status==='granted'){
            this.setState({
                hasCameraPermission:true,
                buttonState:'clicked',
                scanned:'false'
            })
        }
        console.log(this.state.hasCameraPermission)
    }
    handleBarcode=async({type,data})=>{
        const buttonState=this.state.buttonState
        if (buttonState==="bookId"){
        this.setState({
            scanned:true,
            scanBookId:data,
            buttonState:'Normal'
        })}
        else if (buttonState==="studenId"){
            this.setState({
                scanned:true,
                scanBookId:data,
                buttonState:'Normal'
            })
        }
    }
    initiateBookIssue =async()=>{
      db.collection("transaction").add({
        studentId:this.state.scanStudentId,
        BookId:this.state.scanBookId,
        Date:firebase.firestore.Timestamp.now().toDate(),
        TransactionType:"issue"
      })
      db.collection("Books").doc(this.state.scanBookId).update({
        bookAvailability:false
      })
      db.collection("Students").doc(this.state.scanStudentId).update({
        BooksTaken:firebase.firestore.FieldValue.increment(1)
      })
      this.setState({
        scanBookId:'',
        scanStudentId:''
      })
    }
    initiateBookReturn =async()=>{
      db.collection("transaction").add({
        studentId:this.state.scanStudentId,
        BookId:this.state.scanBookId,
        Date:firebase.firestore.Timestamp.now().toDate(),
        TransactionType:"return"
      })
      db.collection("Books").doc(this.state.scanBookId).update({
        bookAvailability:true
      })
      db.collection("Students").doc(this.state.scanStudentId).update({
        BooksTaken:firebase.firestore.FieldValue.increment(-1)
      })
      this.setState({
        scanBookId:'',
        scanStudentId:''
      })
    }
    handleTransaction=async()=>{
      var message=null
      db.collection("books").doc(this.state.scanBookId).get()
      .then(doc=>{
        var book=doc.data()
        if(book.bookAvailability===true){this.initiateBookIssue();
        message="Book is Issued"}
        else{
          this.initiateBookReturn();
          message="book is returned"
        }
      })
      this.setState({
        message:message
      })
    }
  render(){
      const hasCameraPermission=this.state.hasCameraPermission
      const buttonState=this.state.buttonState
      const scanned=this.state.scanned
      if(hasCameraPermission===true && buttonState!=='Normal'){
          return(
            <BarCodeScanner 
            onBarCodeScanned={scanned?undefined:this.handleBarcode}></BarCodeScanner>
          )
        }
        else if(buttonState==='Normal'){
      return(
          <View  style={styles.container}>
              <Image source={require("../assets/booklogo.jpg")}/>
              <Text style={styles.displayText}> 
              Wireless Library </Text>
              <View style={{flexDirection:'row',margin:20}}>
              <TextInput 
              style={styles.inputBox}
              placeholder="Book Id"
              onChangeText={text=>this.setState({scanBookId:text})}
              value={this.state.scanBookId}/>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={()=>{
                this.getCameraPermissions("bookId")
              }}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity> </View>
            <View style={{flexDirection:'row',margin:20}}>
              <TextInput 
              style={styles.inputBox}
              placeholder="Student Id"
              onChangeText={text=>this.setState({scanStudentId:text})}
              value={this.state.scanStudentId}/>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={()=>{
                this.getCameraPermissions("studentId")
              }}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity> </View>
         <TouchableOpacity style={styles.scanButton} onPress={async()=>{await this.handleTransaction()}}>
             <Text style={styles.buttonText}> Scan </Text>
         </TouchableOpacity>
          </View>
      )}
  }
}
const styles = StyleSheet.create({
     container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
     , displayText:{ fontSize: 15, textDecorationLine: 'underline' },
      scanButton:{ backgroundColor: '#2196F3', padding: 10, margin: 10 },
      inputBox:{
        width: 200,
        height: 40,
        borderWidth: 1.5,
        borderRightWidth: 0,
        fontSize: 20
      },
      scanButton:{
        backgroundColor: '#66BB6A',
        width: 50,
        borderWidth: 1.5,
        borderLeftWidth: 0
      },
  
       buttonText:{ fontSize: 20, } });

