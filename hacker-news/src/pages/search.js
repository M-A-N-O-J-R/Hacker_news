import React,{useState,useEffect} from 'react';
import moment from 'moment'
import './search.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function Search() {
    
    var count=0;
    const [currPage,setcurrPage]=useState(0);
    const [type,setType]=useState('All');
    const [cat,setCat]=useState('Date');
    const [dur,setDur]=useState('All Time');
    const [query,setQuery]=useState('');
    const [results,setResult]=useState([]);
    const [res_time,setResponseTime]=useState(0);
    const [res_count,setResCount]=useState(0);
    const options = [
        'one', 'two', 'three'
      ];
    const defaultOption = options[0];
    const fetchData_query=()=>{
        
        fetch(`http://hn.algolia.com/api/v1/search?&hitsPerPage=30&query=${query}&tags=(comment)`)
        .then(response => response.json())
        .then(data => {
            
            console.log(data);
            setResult(data.hits);
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
      }, [query]);
 
    const nextPage = ()=>{
        fetchData();
    }

    const handleChange = (event) => {
        setQuery(event.target.value);
      }
    // const storiesDiv = stories.map((story)=>{
       
    //    var localTime = new Date(story.created_at);
    //    //console.log(localTime); 
    //    const time = moment(localTime, "dddd, dd MMMM yyyy HH:mm:ss").fromNow();
    //    //console.log(story.url);
    //    const url = story.url !== null ? new URL(story.url):null;
    //    count=count+1;
    //    return (
    //    <div key={story.objectID} className="story_item">
    //         <div className='item_row1'>
    //             <span className='item_row1_indx'>{(currPage-1)*20+count}.</span>
    //             <span className='item_row1_indx'>▲</span>
    //             <span><a href={story.url}>{story.title}</a></span>
    //             {story.url!==null?<span id="story_domain"><a href={url.href}>({url.host})</a></span>:<span id="story_domain"><a>null</a></span>}
    //         </div>
    //         <div className='item_row2'>
    //             <p><span>{story.points} point by </span></p>
    //             <p><span>{story.author}</span></p>
    //             <p><a href="#l1">{time}</a></p>
    //             <p className='item_row2_item'><a href="#l1">| hide</a></p>
    //             <p className='item_row2_item'><a href="#l1">| past</a></p>
    //             <p className='item_row2_item'><a href="#l1">| discuss</a></p>
    //         </div>
              
    //     </div>
    //     )
    // })
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
                <p>Search</p>
                <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />;
            </div>
            <div className='res_cont'>
                <p>{res_count.toLocaleString("en-US")} results</p>
                <p>({res_time} seconds)</p>
                <a href="#l1"><img src={'https://cdn-icons-png.flaticon.com/128/929/929610.png'} alt="logo" id = "share_logo"/></a>
            </div>
            <div className='story_cont'>
                {/* {storiesDiv} */}
            </div>
             
        </div>
    );
}

export default Search;