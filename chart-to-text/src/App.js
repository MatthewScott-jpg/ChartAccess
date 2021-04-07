import { VegaLite} from 'react-vega';
import { compile } from "vega-lite/build/vega-lite";
import React, {useState} from "react";
import './App.css';

function App() {
  const [inputSpec, setInputSpec] = useState({});
  const [orgSpec, setOrgSpec] = useState({});
  const [showValues, setShowValues] = useState(false);

  //Getter functions for obtaining aspects of the final Vega spec
  function getMark(){
    const value = inputSpec.marks[0].style[0]
    return value;
  }

  function getX(){
    console.log(orgSpec.encoding.x)
    const value = inputSpec.axes[1].title;
    return value;
  }
  
  function getY(){
    const value = inputSpec.axes[2].title;
    return value;
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
    <div className="App">
      <main>
        {/*<VegaLite spec={spec} data={barData}/>*/}
        {/*<VegaLite spec={spec2} data={newData}/>*/}
        
        <form onSubmit={handleSubmitJSON}>
          <input type="file" name="sourcejson" onChange={(e) => showFile(e)}/>
          <button type="submit">Add Row</button>
        </form>
        <div id={"me"}>me</div>
        <button>Focus the input</button>
        {
          showValues?
          (
          <div>
            <span>{getMark()}</span>
            <span>{getX()}</span>
            <span>{getY()}</span>
          </div>
          ):null
        }
      </main>
    </div>
  );
}

export default App;
