import React,{useState,useEffect} from 'react';
import moment from 'moment'
import './search.css';
import 'react-dropdown/style.css';
import Select from 'react-select';
import DOMPurify from "dompurify";

function Search() {
    
    const [currPage,setcurrPage]=useState(0);
    const [type,setType]=useState('All');
    const [cat,setCat]=useState('Date');
    const [dur,setDur]=useState('All Time');
    const [query,setQuery]=useState('');
    const [results,setResult]=useState([]);
    const [res_time,setResponseTime]=useState(0);
    const [res_count,setResCount]=useState(0);
    const [selectedOpt,setSelectedOpt]=useState({value: '(story,comment)', label: 'All'});
    const [selectedOpt2,setSelectedOpt2]=useState({ value: 'search', label: 'Popularity' });
    const [selectedOpt3,setSelectedOpt3]=useState('Strawberry');  
    const fetchData_query=()=>{
        
        fetch(`http://hn.algolia.com/api/v1/${selectedOpt2.value}?&hitsPerPage=30&query=${query}&tags=${selectedOpt.value}`)
        .then(response => response.json())
        .then(data => {
            
            console.log(data);
            setResult(data.hits);
            setResCount(data.nbHits);
            setResponseTime(data.processingTimeMS/1000);
            setcurrPage(currPage+1);
        });
    }
    const fetchData=()=>{
        
        fetch('http://hn.algolia.com/api/v1/search?&hitsPerPage=30&tags=(comment,story)')
        .then(response => response.json())
        .then(data => {

            console.log(data);
            setResult(data.hits);
            setResponseTime(data.processingTimeMS/1000);
            setcurrPage(currPage+1);
            setResCount(data.nbHits);

        });
    }

    useEffect(() => {
        fetchData();
      }, []);

    useEffect(() => {
        fetchData_query();
      }, [query,selectedOpt,selectedOpt2]);
 
    const nextPage = ()=>{
        fetchData();
    }

    const handleChange = (event) => {
        setQuery(event.target.value);
      }
    const resultsDiv = results.map((story)=>{
       
       var localTime = new Date(story.created_at); 
       const time = moment(localTime, "dddd, dd MMMM yyyy HH:mm:ss").fromNow();
       if(story.parent_id == null)
       {
            const mySafeHTML = DOMPurify.sanitize(story.story_text);
            const url = story.url !== null && story.url!=='' ? new URL(story.url):null;
            return (
            <div key={story.objectID} className="story_item">
                <div className='item_row1'>
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
       
    })
    return(
        <div className='container'>
            <div className='nav_cont'>
                <nav className='navbar'>
                    <li id="l1"><a href="#l1"><img src={'https://news.ycombinator.com/y18.gif'} alt="logo" id = "pro_logo"/></a></li>
                    <li id="pro_name"><a href="#l1">Search Hacker News</a></li>
                    <li className='nav_item curr_item'><input type="textbox" onChange={handleChange}></input></li>
                    <li id='login'><a href="#login">login</a></li>
                </nav>
            </div>
            <div className='search_cont'>
                <div>
                    <p>Search</p>
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

                <div>
                    <p>by</p>
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

                <div>
                    <p>for</p>
                    <Select
                    value={selectedOpt3}
                    onChange={(value) =>{
                        setSelectedOpt3(value);
                    }}
                    options={[
                        { value: 'chocolate', label: 'Chocolate' },
                        { value: 'strawberry', label: 'Strawberry' },
                        { value: 'vanilla', label: 'Vanilla' },
                    ]}
                    className="drop_down"
                />
                </div>
                
            </div>
            <div className='res_cont'>
                <p>{res_count.toLocaleString("en-US")} results</p>
                <p>({res_time} seconds)</p>
                <a href="#l1"><img src={'https://cdn-icons-png.flaticon.com/128/929/929610.png'} alt="logo" id = "share_logo"/></a>
            </div>
            <div className='story_cont'>
                {resultsDiv}
            </div>
             
        </div>
    );
}

export default Search;