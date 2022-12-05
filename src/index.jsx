import {createRoot} from 'react-dom/client';
import React, { useReducer, useState, Children, useEffect, useRef, useLayoutEffect } from 'react';
import './index.css';
import Img1 from './img/background-1.jpg';
import Img2 from './img/background-2.jpg';
import Img3 from './img/background-3.jpg';
import Img4 from './img/background-4.jpg';
import Img5 from './img/background-5.jpg';
import Img6 from './img/background-6.jpg';

// ===================== Exercice 1 =====================

function Search() {
    const items = ['Banana', 'Apple', 'Orange', 'Mango', 'Pineapple', 'Watermelon']
    const [value, setValue] = useState('');

    const handleChange = function(e) {
        setValue(e.target.value)
    }

    return (
        <div className='exo1'>
            <label htmlFor="searchFruit">Search: </label>
            <input type="text" id='searchFruit' name='searchFruit' value={value} onChange={handleChange}/>
            {items
                .filter(item => item.toLowerCase().includes(value.toLowerCase()))
                .map((item, index) => <p key={item+index}>{item}</p>)}
        </div>
    )
}

// ===================== Exercice 2 =====================

const counterReducer = function(state, action){
    switch(action.type){
        case 'increment':
            return state + action.step;
        case 'decrement':
            return state - action.step;
        default:
            throw new Error("The given type in counterReducer doesn't exist.");
    }
}

function Counter({start=0, step=10}) {
    const [value, dispatchValue] = useReducer(counterReducer, start);

    return (
        <div className='exo2'>
            <button onClick={()=>dispatchValue({type: 'decrement', step})}>-</button>
            {value}
            <button onClick={()=>dispatchValue({type: 'increment', step})}>+</button>
        </div>
    )
}

// ===================== Exercice 3 =====================
// This is not the main purpose of the exercice, but i wanted to work with React.Children function

function PersonalList({children}) {
    const [items, setItems] = useState([])
     
    useEffect(() => {
        const values = [];

        // Get the type of first child and it's content + the next inner child(s).
        Children.forEach(children, (({type, props:{children}}) => {
            if ((type == 'li') && (children.length == 2) && (children[1].type == 'span'))
                values.push({title: children[0], subTitle: children[1].props.children})
        }));

        setItems(values);
    }, []);

    return (
        <div className='exo3'>
            <ul>
                {items.map((item, index) => <li key={item.title+index}>
                    <h5>{item.title}</h5>
                    <p>{item.subTitle}</p>
                    </li>)}
            </ul>
        </div>
    )

}


// ===================== Exercice 4 =====================

const PersonalAccordion = ({title, children}) => {
    const [accordions, setAccordions] = useState({});
    const parent = useRef(null);
    const body = useRef(null);

    const handleClick = (e) => {
        parent.current.classList.toggle('show');
        body.current.style.display = body.current.style.display === "none" ? "block": "none";
    }

    return (
        <div className='exo4'>

            <div className="accordion" ref={parent} onClick={handleClick}>
                <div className="accordion-title">
                    <p>{title}</p>
                    <button>{'<'}</button>
                </div>
                <div className="accordion-body" ref={body} style={{display: 'none'}}>
                    <p>{children}</p>
                </div>
            </div>
        </div>
    )

}


// ===================== Exercice 5 =====================

const ImageSliderElt = ({url, position}) => {
    const image = useRef(null);

    useEffect(()=>{
        image.current.style.transform = 'translateX('+ position*100 +'%)'
    }, [position])

    return <img src={url} alt="" ref={image} />

}

const useImageUpdate = (imageUrls, currentIndex) => {
    const [imgList, setImgList] = useState([]);

    useEffect(() => {
        const imgArray = [];

        imageUrls.forEach((img, index) => {
            const currentOffsetPosition = index - currentIndex

            imgArray.push(<ImageSliderElt 
                key={'image-'+index} 
                url={img} 
                position={currentOffsetPosition}/>)
        })

        setImgList(imgArray);

    }, [currentIndex])

    return imgList;
}

const imgIndexReducer = (state, action)=>{
    switch(action.type){
        case 'increment':
            return (state + 1) % action.limit;
        case 'decrement':
            return (state === 0) ? (action.limit - 1) : (state - 1);
        default:
            throw new Error("The action provided in imgIndexReducer isn't implemented.");
    }
}

const useSliderSelecterList = (imgList, currentIndex) => {
    const [sliderSelectList, setSliderSelectList] = useState([]);

    useEffect(()=>{
        const length = imgList.length;
        const sliderEltArray = [];

        for(let i = 0; i < length; i++){
            let currentClassName = 'slideSelecter-elt ' + ((currentIndex === i)?'show':'');
            sliderEltArray.push(<div className={currentClassName} key={'slideSelect'+i}></div>);
        }

        setSliderSelectList(sliderEltArray);
    }, [imgList])

    return sliderSelectList;
}

const ImageSlider = ({imageUrls}) => {
    const [play, setPlay] = useState(false)
    const [index, dispatchIndex] = useReducer(imgIndexReducer, 0);
    const imgList = useImageUpdate(imageUrls, index);
    const sliderSelecterList = useSliderSelecterList(imgList, index);

    const togglePlay = (e) => {
        setPlay(!play)
    }

    useEffect(()=> {
        let timer = null;

        if(play){
            timer = setInterval(()=> {
                dispatchIndex({type: 'increment', limit: imgList.length})
            }, 3000);
        }

        return (()=>{
            clearInterval(timer);
        })
    }, [index, play])

    return (
        <div className="exo5">
            {!play && <div className="prev"
                onClick={()=>dispatchIndex({type: 'decrement', limit: imgList.length})}>{'<'}</div>}
            {!play && <div className="next"
                onClick={()=>dispatchIndex({type: 'increment', limit: imgList.length})}>{'>'}</div>}
            <button className="play" onClick={togglePlay}>{play?'pause':'play'}</button>
            <div className="slideSelecter">
                {sliderSelecterList}
            </div>
            {imgList}
        </div>
    )
}

// ===================== Exercice 6 =====================

const INITIAL_CHECKLIST = {
    citizen: false,
    major: false,
    liveInUSA: true,
    newsletter: false
}

const checklistReducer = (state, action) => {
    switch(action) {
        case 'citizen':
            return {...state, citizen: !state.citizen};
        case 'major':
            return {...state, major: !state.major};
        case 'liveInUSA':
            return {...state, liveInUSA: !state.liveInUSA};
        case 'newsletter':
            return {...state, newsletter: !state.newsletter};
        default:
            throw new Error("The provided action isn't covered in checklistReducer.");
    }
}

const CheckboxField = ({name, onChange, value, children}) => {
    return <div className="checkbox-field">
        <label htmlFor={name}>{children} </label>
        <input type="checkbox" name={name} id={name} onChange={()=>onChange(name)} checked={value}/>
    </div>
}

const Checklist = () => {
    const [{citizen, major, liveInUSA, newsletter}, dispatchChecklist] = useReducer(checklistReducer, INITIAL_CHECKLIST);

    const answer = (entry) => entry ? 'Yes' : 'No';

    return (
        <div className="exo6">
            <h2>Are you a citizen : {answer(citizen)}</h2>
            <h2>Are you major : {answer(major)}</h2>
            <h2>Do you live in the US : {answer(liveInUSA)}</h2>
            <h2>Do you want to subscribe to the newsletter : {answer(newsletter)}</h2>

            <CheckboxField name={"citizen"} onChange={dispatchChecklist} value={citizen}>
                Are you a citizen : 
            </CheckboxField>
            <CheckboxField name={"major"} onChange={dispatchChecklist} value={major}>
                Are you major : 
            </CheckboxField>
            <CheckboxField name={"liveInUSA"} onChange={dispatchChecklist} value={liveInUSA}>
                Do you live in the US : 
            </CheckboxField>
            <CheckboxField name={"newsletter"} onChange={dispatchChecklist} value={newsletter}>
                Do you want to subscribe to the newsletter :
            </CheckboxField>
        </div>
    )
}

// ===================== Exercice 7 =====================

const INITIAL_FORM = { 
    name: "", 
    email: "", 
    password: "" 
}


// function verifyName(input) {
//     if (input)
// }

const SimpleForm = () => {
    const [formValues, setFormValues] = useState(INITIAL_FORM);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState([false, '']);
    const {name, email, password} = formValues;

    const handleChange = (e) => {
        setFormValues({...formValues, [e.target.id]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({name, email, password});
    }

    return <div className='exo7'>

        {success ?
        <h1>Welcome, {name}</h1> :
        <form action="" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Enter a name : </label>
                <input type="text" id='name' name='name' value={name} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="email">Enter an email : </label>
                <input type="email" id='email' name='email' value={email} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="password">Enter a password : </label>
                <input type="password" id='password' name='password' value={password} onChange={handleChange}/>
            </div>
            <button type="submit">Valider</button>
        </form>}
    </div>
}

// ===================== Exercice 1 =====================
// ===================== Exercice 1 =====================


// ===================== RENDER =====================

const root = createRoot(document.getElementById('app'));
root.render(
    <>
    <h3>1. Build Search filter in React</h3>
    <Search />
    <h3>2. Simple counter exercise</h3>
    <Counter />
    <h3>3. Display a list in React</h3>
    <PersonalList>
        <li>My new website <span>Written by maria</span></li>
        <li>Welcome party! <span>Written by yoshi</span></li>
        <li>Web dev top tips <span>Written by mario</span></li>
    </PersonalList>
    <h3>4. Build Accordion in React</h3>
    <div className="exo4">
        <PersonalAccordion title={'What is your return policy?'}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum optio excepturi quaerat est, ea labore possimus sint illum necessitatibus facilis?
        </PersonalAccordion>
        <PersonalAccordion title={'How do I track my order?'}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum optio excepturi quaerat est, ea labore possimus sint illum necessitatibus facilis?
        </PersonalAccordion>
        <PersonalAccordion title={'Can I purchase items again?'}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum optio excepturi quaerat est, ea labore possimus sint illum necessitatibus facilis?
        </PersonalAccordion>
    </div>
    <h3 id='ex5'>5. Image Slider using React JS</h3>
    <ImageSlider imageUrls={[
        Img1,
        Img2,
        Img3,
        Img4,
        Img5,
        Img6,
    ]}/>
    <h3 id='ex6'>6. Create a Checklist in React</h3>
    <Checklist />
    <h3 id='ex7'>7. Simple Login form in React</h3>
    <SimpleForm />
    </>
)