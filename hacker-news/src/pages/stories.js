import React,{useState,useEffect} from 'react';
import moment from 'moment'

function Stories() {
    
    const [currPage,setcurrPage]=useState(0);
    const [stories,setStories]=useState([]);
    const fetchData=()=>{
    
        fetch('https://hn.algolia.com/api/v1/search_by_date?tags=story&page='+currPage)
        .then(response => response.json())
        .then(data => {
            
            setStories(data.hits);
            setcurrPage(currPage+1);
        });
    }
    useEffect(() => {
        fetchData();
      }, []);

      function convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
    
        newDate.setHours(hours - offset);
    
        return newDate;   
    }

    const storiesDiv = stories.map((story)=>{
       
       var localTime = new Date(story.created_at).toTimeString();
       var dateArr = localTime.split(' ')
       const time = moment(dateArr[0], "HH:mm:ss").fromNow();
       return (
       <div key={story.objectID
       }>
            <p>{story.title}</p>
            <p>{story.points} point by </p>
            <p>{story.author}</p>
            <p>{time}</p>
            
        </div>
        )
    })
    return(
        <>
            <div>
                <nav className='navbar'>
                    <li id="l1"><a href="#l1"><img src={'https://news.ycombinator.com/y18.gif'} alt="logo" className="img-responsive"/></a></li>
                    <li><a href="#l1">Hacker News</a></li>
                    <li><a href="#l1">new</a></li>
                    <li><a href="#l1">past</a></li>
                    <li><a href="#l1">comment</a></li>
                    <li><a href="#l1">ask</a></li>
                    <li><a href="#l1">show</a></li>
                    <li><a href="#l1">jobs</a></li>
                    <li><a href="#l1">submit</a></li>
                    <li><a href="#l1">login</a></li>
                </nav>
            </div>
            {storiesDiv}
        </>
    );
}

export default Stories;