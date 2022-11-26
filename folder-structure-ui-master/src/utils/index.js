import { useState } from "react";
import { useSelectedNodeState, useTreeState } from "../contexts";

export function uid() {
    return (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,"");
};

export const initialFamilyInfoState = {
    "Name" : "",
    "Spouse" : "",
    "Location" : "",
    "Birth Year" : "",
    "Present Address" : "",
    "Family Photo" : null
}

export const useAddFamily = ({initialFamilyInfoState, afterAdding = () => {}, }) => {

    const [familyInfo, setFamilyInfo] = useState(initialFamilyInfoState)
  
    const [selectedNode] = useSelectedNodeState()
    const [treeState, setTreeDataState] = useTreeState()
  
    const addFamily = (e) => {
      e.preventDefault()
      
      selectedNode && setTreeDataState(prevTree => {
        
        const clone = {...prevTree}
        
        const uId = uid()
        let currentNode = clone
        
        selectedNode.ancentors.forEach((node, i)=> {
          if(i !== 0){
            currentNode = currentNode.children[node]
          }
        })
        currentNode.children = currentNode.children ? {...currentNode.children, [uId] : {id: uId, ...familyInfo}} : {[uId] : {id: uId, ...familyInfo}}
        addTODb(selectedNode,currentNode.children);
        return clone
      })
  
      !selectedNode && Object.keys(treeState).length === 0 && setTreeDataState(() => {
        let id = uid();
        addTODb(null,[{id,...familyInfo}]);
        return{
          id,
          ...familyInfo
        }
      })
      // handleClose()
      afterAdding()
      setFamilyInfo(initialFamilyInfoState)
    }
  
    const addTODb=async (parent,children)=>{
    children=(Object.values(children));
    let child;
    if(parent==null){
      child=children[0];
      parent={id:0}  
    }
    else
    child=children.pop()
    console.log(parent,child);
      const res=await fetch('http://localhost:8080/add',{
        method:'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
        id:child.id,parent:parent.id,name:child.Name,spouse:child.Spouse,location:child.Location,birthYear:child['Birth Year'],address:child['Present Address']
      })
      });
      const data=await res.json();
      console.log('data',data)
    }

    const setFamilyInfoState = e => {
      const {name, value} = e.target
      setFamilyInfo(prevState => {
        return {
          ...prevState,
          [name] : value
        }
      })
    }
  
    const onPicUpload = e => {
      // const picUrls = e.target.files.map(file => URL.createObjectURL(file))
      const picUrls = []
  
      const allSelectedImgs =  e.target.files
  
      for (let index = 0; index < allSelectedImgs.length; index++) {
        const currentImg = allSelectedImgs[index];
        picUrls.push(URL.createObjectURL(currentImg))
      }
  
      picUrls.length > 0 && setFamilyInfo(prevState => {
        return{
          ...prevState,
          "Family Photo" : picUrls
        }
      })
    }
  
    return {familyInfo, setFamilyInfoState, addFamily, onPicUpload}
  }

const onloadCleanCollections=async ()=>{
  const res=await fetch('http://localhost:8080/clean',{
      method:'GET'
    });
    const data=await res.json();
    console.log('data',data)
}
onloadCleanCollections();