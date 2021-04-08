import {Vega} from 'react-vega';
import { compile } from "vega-lite/build/vega-lite";
import React, {useState} from "react";
import css from './App.module.css';

function App() {
  const [inputSpec, setInputSpec] = useState({});
  const [orgSpec, setOrgSpec] = useState({});
  const [showValues, setShowValues] = useState(false);

  //Getter function for obtaining aspects of the final Vega spec
  function getInfo(){
    const mark = inputSpec.marks[0].style[0];
    var xTitle = inputSpec.axes[1].title;
    var yTitle = inputSpec.axes[2].title;
    var style = "";

    if (xTitle.includes("binned") && orgSpec.encoding.x.hasOwnProperty("field")){
      xTitle = orgSpec.encoding.x.field;
    }

    if (mark === "bar"){
      style = getBarType()
    }
    const sent1 = "This is a ".concat(style);
    const sent2 = ". Its x axis is ".concat(xTitle);
    const sent3 = ". Its y axis is ".concat(yTitle);
    var sent4 = "";
    
    if (style === "Bar Chart"){
      //note the use of quantites, could look into using x, y type here
      sent4 = ". Its purpose is to compare different quantities of ".concat(yTitle, " for each type of ", xTitle);
    }
    else if (style === "Histogram"){
      sent4 = ". Its purpose is to compare ".concat(yTitle, " for intervals of ", xTitle);
    }

    return sent1.concat(sent2,sent3, sent4);
  }

  //Differentiates bar chart and histogram
  function getBarType(){
    if (orgSpec.encoding.x.hasOwnProperty("bin")){
      if (orgSpec.encoding.x.bin === true){
        return "Histogram";
      }
    }
    else{
      return "Bar Chart";
    }
  }

  //Reveals spec values on file submission
  function handleSubmitJSON(e){
    setShowValues(true);
    e.preventDefault();

  }

  //obtains data from input url
  async function getURLJSON(url){
    const response = await fetch(url);
    const data = await response.json();
    return data;      
  }

  //reads vega file, handles data in url case, sets vega-lite and vega state objects
  async function showFile(e){
    setShowValues(false);
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
      const liteSpec = JSON.parse(text);
      if (liteSpec.data.hasOwnProperty("url")){
        liteSpec.data.values = await getURLJSON(liteSpec.data.url);
      }
      const vegaspec = compile(liteSpec).spec;
      console.log(vegaspec)
      setInputSpec(vegaspec);
      setOrgSpec(liteSpec);
    };
    reader.readAsText(e.target.files[0])
  }
  
  return (
    <div className={css.App}>
      <main>
        <form onSubmit={handleSubmitJSON}>
          <input type="file" name="sourcejson" onChange={(e) => showFile(e)}/>
          <button type="submit">Add Row</button>
        </form>
        {
          showValues?
          (
          <div className={css.grid}>
            <div className={css.chartDisplay}>
              <Vega spec={inputSpec}/>
            </div>
            <div className={css.descDisplay}>
              <p>{getInfo()}</p>
            </div>
          </div>
          ):null
        }
      </main>
    </div>
  );
}

export default App;
