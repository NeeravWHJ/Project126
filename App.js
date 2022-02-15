import * as React from "react"; 
import { StyleSheet, Text, View,Button,Platform } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import PickImage from "./screens/camera"

export default class App extends React.Component {

  state = {
    image:null,
  }

  getPermissionasync = async()=>{
    if(Platform.OS!== "web"){
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if(status!=="granted"){
        alert("Sorry we need permission")
      }
    }
  }

  componentDidMount(){
    this.getPermissionasync()
  }

  uploadImage = async(uri)=>{
    const data = new FormData();
    let filename = uri.split("/")[uri.split("/").length-1]
    let type = `image/${uri.split(".")[uri.split(".").length-1]}`
    const filetoupload = {
      uri:uri,
      name:filename,
      type:type,
    }
    data.append("digit",filetoupload);
    fetch("",
    {
      method:"POST",
      body:data,
      headers:{
        "content-type":"multipart/form-data"
      },

    })
    .then((response)=>response.json())
    .then((result)=>{
      console.log("Success:",result)
    })
    .catch((error)=>{
      console.error("error:",error)                                              
    })
  }

  pickimage = async()=>{
    try{
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:ImagePicker.MediaTypeOptions.All,
        allowsEditing:true,
        aspect:[4,3],
        quality:1
      })
      if(!result.cancelled){
        this.setState({
          image:result.data
        })
        console.log(result.uri)
        this.uploadImage(result.uri)
      }
    }
    catch(E){
      console.log(E)
    }
  }

  render(){
    let {image}= this.state
  return (
    <View>
      <Button
      title="Pick an image from camera roll"
      onPress={this.pickimage}
      />
    </View>

  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

