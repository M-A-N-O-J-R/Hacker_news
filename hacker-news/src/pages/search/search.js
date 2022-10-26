import React,{useState,useEffect} from 'react';
import moment from 'moment'
import './search.css';
import 'react-dropdown/style.css';
import Select from 'react-select';
import DOMPurify from "dompurify";
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import ReactDOM from "react-dom";
import Mark from "mark.js";
import "react-datepicker/dist/react-datepicker.css";
function Search() {
    

    const [flag,setFlag]=useState(true);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [currPage,setcurrPage]=useState(0);
    const [totalPages,setTotalPages]=useState(0);
    const [query,setQuery]=useState('');
    const [results,setResult]=useState([]);
    const [res_time,setResponseTime]=useState(0);
    const [res_count,setResCount]=useState(0);
    const [selectedOpt,setSelectedOpt]=useState({value: '(story,comment)', label: 'All'});
    const [selectedOpt2,setSelectedOpt2]=useState({ value: 'search', label: 'Popularity' });
    const [selectedOpt3,setSelectedOpt3]=useState({ value: 0, label: 'All time' });  
    
    var options = {
        "element": "mark",
        "className": "highlight",
        "exclude": [],
        "separateWordSearch": false,
        "accuracy": "partially",
        "diacritics": true,
        "synonyms": {},
        "iframes": false,
        "iframesTimeout": 5000,
        "acrossElements": false,
        "caseSensitive": false,
        "ignoreJoiners": false,
        "ignorePunctuation": [],
        "wildcards": "disabled",
        "each": function(node){
            // node is the marked DOM element
        },
        "filter": function(textNode, foundTerm, totalCounter, counter){
            // textNode is the text node which contains the found term
            // foundTerm is the found search term
            // totalCounter is a counter indicating the total number of all marks
            //              at the time of the function call
            // counter is a counter indicating the number of marks for the found term
            return true; // must return either true or false
        },
        "noMatch": function(term){
            // term is the not found term
            setFlag(false);
        },
        "done": function(counter){
            // counter is a counter indicating the total number of all marks
        },
        "debug": false,
        "log": window.console
    };
    
    
    const fetchData_query=()=>{
        
        var time_stamp1=((moment().valueOf()/1000)-(selectedOpt3.value*60*60));
        var time_stamp2=((moment().valueOf()/1000));
        if(selectedOpt3.label == "Custom range")
        {
            time_stamp1=(moment(startDate).valueOf()/1000)
            time_stamp2=(moment(endDate).valueOf()/1000);
        }
        if(selectedOpt3.label == "All time")
        {
            time_stamp1=0;
            time_stamp2=(moment().valueOf()/1000);
        }
        //console.log(moment().valueOf()/1000);
        //console.log(time_stamp1);
        //console.log(time_stamp2);
        fetch(`http://hn.algolia.com/api/v1/${selectedOpt2.value}?&hitsPerPage=30&query=${query}&tags=${selectedOpt.value}&page=${currPage}&numericFilters=created_at_i>=${time_stamp1},created_at_i<=${time_stamp2}`)
        .then(response => response.json())
        .then(data => {
            
            console.log(data);
            setTotalPages(data.nbPages)
            setResult(data.hits);
            setResCount(data.nbHits);
            setResponseTime(data.processingTimeMS/1000);
        });
    }
    const fetchData=()=>{
        
        fetch('http://hn.algolia.com/api/v1/search?&hitsPerPage=30&tags=(comment,story)&page='+currPage)
        .then(response => response.json())
        .then(data => {

            //console.log(data);
            setTotalPages(data.nbPages)
            setResult(data.hits);
            setResponseTime(data.processingTimeMS/1000);
            setResCount(data.nbHits);

        });
    }

      useEffect(() => {

        var markInstance = new Mark(document.querySelector(".story_cont"));
        markInstance.unmark({
            done: () => {
                markInstance.mark(query,options);
            }
            });
      }, [results]);

    useEffect(() => {
        fetchData_query();
      }, [query,selectedOpt,selectedOpt2,selectedOpt3,startDate,endDate,currPage]);
 
    const handlePageClick = ({selected})=>{
        //console.log(selected);
        setcurrPage(selected);
    }

    const handleChange = (event) => {
        setQuery(event.target.value);
      }
    var resultsDiv = results.length>0  ? results.map((story)=>{
       
       var localTime = new Date(story.created_at); 
       const time = moment(localTime, "dddd, dd MMMM yyyy HH:mm:ss").fromNow();
       //var date =   localTime;
       //console.log(story.created_at_i);
       //var time2= moment().valueOf();
       //console.log(time2);
       if(story.parent_id == null)
       {
            const mySafeHTML = DOMPurify.sanitize(story.story_text);
            const url = story.url !== null && story.url!=='' ? new URL(story.url):null;
            return (
            <div key={story.objectID} className="story_item">
                <div className='item_row_1'>
                    <span><a style={{fontSize:"14px",fontWeight:"500"}} href={story.url}>{story.title}</a></span>
                    {story.url!==null && story.url!=='' ?<span id="story_domain"><a href={url.href}>({url.host})</a></span>:<span id="story_domain"><a>null</a></span>}
                </div>
                <div className='item_row_2 search_row2'>
                    <p className='item_row2_item'><a href="#l1">{story.points} points </a></p>
                    <p className='item_row2_item'><a href="#l1">| {story.author}</a></p>
                    <p className='item_row2_item'><a href="#l1">| {time}</a></p>
                    <p className='item_row2_item'><a href="#l1">| {story.num_comments} comments</a></p>
                </div>
                <div style={{textAlign: "left",fontSize:"12px",lineHeight:"15px"}} dangerouslySetInnerHTML={{ __html: mySafeHTML }} />
            </div>
            )
       }
       else
       {
        const mySafeHTML = DOMPurify.sanitize(story.comment_text);
        return (
            <div style={{marginBottom:"18px"}} key={story.objectID} className="story_item">
                <div style={{lineHeight:"5px",padding:"0px"}} className='item_row_2 search_row2'>
                    <p className='item_row2_item'><a href="#l1">{story.points} points </a></p>
                    <p className='item_row2_item'><a href="#l1">| {story.author}</a></p>
                    <p className='item_row2_item'><a href="#l1">| {time}</a></p>
                    <p className='item_row2_item'><a href="#l1">| on: {story.story_title}</a></p>
                </div>
                {/* <div className='item_row1'>
                    <span><a style={{fontSize:"14px",fontWeight:"500"}} href={story.url}>{story.title}</a></span>
                    {story.url!==null && story.url!=='' ?<span id="story_domain"><a href={url.href}>({url.host})</a></span>:<span id="story_domain"><a>null</a></span>}
                </div> */}
                <div style={{textAlign: "left",fontSize:"12px",lineHeight:"15px"}} dangerouslySetInnerHTML={{ __html: mySafeHTML }} />
            </div>
            )
       }
       
    }):<div style={{paddingBottom:"30px","marginTop":"20px"}}> We found no items matching your query for this period.</div>
    return(
        <div className='container'>
            <div className='nav_cont'>
                <nav className='navbar_2'>
                    <li id="l1"><a href="#l1"><img src={'https://d1sz9gun5ag95e.cloudfront.net/packs/media/images/logo-hn-search-a822432b.png'} alt="logo" id = "pro_logo_2"/></a></li>
                    <li ><a href="#l1" id="pro_name_2"><div>Search</div><div>Hacker News</div></a></li>
                    <li className='nav_item curr_item' style={{width:"60%"}}><input placeholder='Search stories by title,url or author' id="search_box" type="textbox" onChange={handleChange}></input></li>
                    <li id='login'><a href="#login">Settings ⚙️</a></li>
                </nav>
            </div>
            <div className='search_cont'>
                <div className='label_box'>
                    <div style={{marginRight:"7px"}}>Search</div>
                    <Select
                    value={selectedOpt}
                    onChange={(value) =>{
                        //console.log(value.value);
                        setSelectedOpt(value);
                        // console.log(selectedOpt);
                    }}
                    options={[
                        { value: '(story,comment)', label: 'All' },
                        { value: 'story', label: 'Stories' },
                        { value: 'comment', label: 'Comments' },
                    ]}
                    className="drop_down"
                />
                </div>

                <div className='label_box'>
                    <div style={{marginRight:"7px"}}>by</div>
                    <Select
                    value={selectedOpt2}
                    onChange={(value) =>{
                        //console.log(value.value);
                        setSelectedOpt2(value);
                        //console.log(selectedOpt2);
                    }}
                    options={[
                        { value: 'search', label: 'Popularity' },
                        { value: 'search_by_date', label: 'Date' },
                    ]}
                    className="drop_down"
                />
                </div>

                <div className='label_box'>
                    <div style={{marginRight:"7px"}}>for</div>
                    <Select
                    value={selectedOpt3}
                    onChange={(value) =>{
                        setSelectedOpt3(value);
                    }}
                    options={[
                        { value: 0, label: 'All time' },
                        { value: 24, label: 'Last 24h' },
                        { value: 7*24, label: 'Past Week' },
                        { value: 31*24, label: 'Past Month' },
                        { value: 365*24, label: 'Past Year' },
                        { value: 0, label: 'Custom range' }
                    ]}
                    className="drop_down"
                />
                </div>
                <div className='res_cont'>
                    <div style={{marginRight:"7px"}}>{res_count.toLocaleString("en-US")} results</div>
                    <div style={{marginRight:"25px"}}>({res_time} seconds)</div>
                    <a href="#l1"><img src={'https://cdn-icons-png.flaticon.com/128/929/929610.png'} alt="logo" id = "share_logo"/></a>
                </div>
            </div>
            {selectedOpt3.label === 'Custom range'?<div className='dates_cont'><span>From</span><DatePicker selected={startDate} onChange={(date) => setStartDate(date)} /><span>To</span><DatePicker selected={endDate} onChange={(date) => setEndDate(date)} /></div>:null}
            <div className='story_cont'>
                {resultsDiv}
            </div>
            {results.length>0?<ReactPaginate
                breakLabel="..."
                pageCount={totalPages}
                nextLabel="next"   
                previousLabel="previous"
                onPageChange={handlePageClick}
                containerClassName={"paginationBtns"}
                activeClassName={"paginationBtnsAct"}
            />:null }
            
        </div>
        
    );
}

export default Search;