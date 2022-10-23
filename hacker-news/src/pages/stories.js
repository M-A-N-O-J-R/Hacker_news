import React,{useState,useEffect} from 'react';
import moment from 'moment'
import './stories.css';

function Stories() {
    
    const [currPage,setcurrPage]=useState(0);
    var count=0;
    const [stories,setStories]=useState([]);
    const fetchData=()=>{
    
        fetch('https://hn.algolia.com/api/v1/search_by_date?tags=story&page='+currPage)
        .then(response => response.json())
        .then(data => {
            
            console.log(data);
            setStories(data.hits);
            setcurrPage(currPage+1);
        });
    }
    useEffect(() => {
        fetchData();
      }, []);
 
    const nextPage = ()=>{
        fetchData();
    }
    const storiesDiv = stories.map((story)=>{
       
       var localTime = new Date(story.created_at);
       console.log(localTime);
       localTime=localTime.toTimeString();
       var dateArr = localTime.split(' ');
       console.log(localTime);
       const time = moment(dateArr[0], "HH:mm:ss").fromNow();
       count=count+1;
       return (
       <div key={story.objectID} className="story_item">
            <div className='item_row1'>
                <p><span>{(currPage-1)*20+count}</span></p>
                <span><a href={story.url}>{story.title}</a></span>
                <span id="story_domain"><a>(youtube)</a></span>
            </div>
            <div className='item_row2'>
                <p><span>{story.points} point by </span></p>
                <p><span>{story.author}</span></p>
                <p><a href="#l1">{time}</a></p>
                <p className='item_row2_item'><a href="#l1">| hide</a></p>
                <p className='item_row2_item'><a href="#l1">| past</a></p>
                <p className='item_row2_item'><a href="#l1">| discuss</a></p>
            </div>
              
        </div>
        )
    })
    return(
        <div className='container'>
            <div className='nav_cont'>
                <nav className='navbar'>
                    <li id="l1"><a href="#l1"><img src={'https://news.ycombinator.com/y18.gif'} alt="logo" id = "pro_logo"/></a></li>
                    <li id="pro_name"><a href="#l1">Hacker News</a></li>
                    <li className='nav_item curr_item'><a href="#l1">new</a></li>
                    <li className='nav_item'><a href="#l1">past</a></li>
                    <li className='nav_item'><a href="#l1">comment</a></li>
                    <li className='nav_item'><a href="#l1">ask</a></li>
                    <li className='nav_item'><a href="#l1">show</a></li>
                    <li className='nav_item'><a href="#l1">jobs</a></li>
                    <li className='nav_item'><a href="#l1">submit</a></li>
                    <li id='login'><a href="#login">login</a></li>
                </nav>
            </div>
            <div className='story_cont'>
                {storiesDiv}
            </div>
            <button id="btn_more" onClick={nextPage}>
                More
            </button>  
        </div>
    );
}

export default Stories;