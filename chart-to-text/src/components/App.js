import {Vega} from 'react-vega';
import { compile } from "vega-lite/build/vega-lite";
import React, {useState} from "react";
import css from './App.module.css';
import {MemoizedExtract} from './extractFeatures.js'
import FileLoader from '../FileLoader.js';

function App() {
  const [inputSpec, setInputSpec] = useState({});
  const [orgSpec, setOrgSpec] = useState({});
  const [showValues, setShowValues] = useState(false);
  const [dragging, setDragging] = useState(false); // to show a dragging effect

  //handlers for file dragging
  function handleFileDragEnter(e){
    setDragging(true);
  }
  function handleFileDragLeave(e){
    setDragging(false);
  }
  //parses json file on drop, returns vega and vega-lite specs
  async function handleFileDrop(e){
    if (e.dataTransfer.types.includes('Files')===false){
			return;
    }
    if (e.dataTransfer.files.length>=1){
      let file = e.dataTransfer.files[0];
      if (file.size>1000000){// larger than 1 MB
        return;
      }
      setShowValues(false);
      if (file.type.match(/json.*/)){
				let reader = new FileReader();			
				reader.onload = async (e) => {
          const text = (e.target.result);
          const liteSpec = JSON.parse(text);
          if (liteSpec.data.hasOwnProperty("url")){
            liteSpec.data.values = await getURLJSON(liteSpec.data.url);
          }
          const vegaspec = compile(liteSpec).spec;
          setInputSpec(vegaspec);
          setOrgSpec(liteSpec);
          setShowValues(true);
				};
				reader.readAsText(file);
			}
    }
    setDragging(false);
    e.preventDefault();
  }

  //obtains data from input url
  async function getURLJSON(url){
    const response = await fetch(url);
    var data = '';
    if (url.endsWith('.csv')){
      data = await response.text();
      data = transform(data);
    }
    else if (url.endsWith('.json')){
      data = await response.json();
    }
    //console.log(data)
    return data;      
  }

  function transform(str) {
    let data = str.split('\n').map(i=>i.split(','));
    let headers = data.shift();
    let output = data.map(d=>{
      var obj = {};
      headers.map((h,i)=>obj[headers[i]] = d[i]);
      return obj;
    });
    return output
  }
  
  return (
    <div className={css.App}>
      <main>
        {
          showValues?
          (
          <div className={css.grid}>
            <div className={css.chartDisplay}>
              <Vega spec={inputSpec}/>
            </div>
            <div className={css.descDisplay}>
              <MemoizedExtract liteSpec={orgSpec} vegaSpec={inputSpec}/>
            </div>
          </div>
          ):null
        }

      <div className={css.photo}>
          <div className={css.message}>Drop your file</div>
            <FileLoader
              onDragEnter={handleFileDragEnter}
              onDragLeave={handleFileDragLeave}
              onDrop={handleFileDrop}
            >
              <div className={[css.dropArea, dragging?css.dragging:null].join(' ')}></div>
            </FileLoader>
        </div>
      </main>
    </div>
  );
}

export default App;