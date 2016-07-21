import xs from 'xstream'
import fromEvent from 'xstream/extra/fromEvent'
import tween from 'xstream/extra/tween'

import styl from './app.styl'

const sections = Array.from(document.querySelectorAll('section'))
const anchors = sections.map(section => section.offsetTop)
let animated = false
const determineIndex =
  a =>
    a.reduce((acc, x) =>{
      return window.scrollY === 0
      ? acc
      : x >= window.scrollY
        ? acc
        : acc + 1
    }, 0)
function goTo(start, end){
  return tween({
    from: start,
    to: end,
    ease: tween.exponential.easeOut,
    duration: 1000, // milliseconds
  })
}

fromEvent(window, 'keydown')
.addListener({
  next: e => {
    const index = determineIndex(anchors)
    if( e.keyCode === 40 ){
      if(index !== anchors.length - 1 && !animated){
        animated = true
        goTo(window.scrollY, anchors[index + 1])
        .addListener({
          next: y => window.scrollTo(0, y)
        , error: x => console.error(x)
        , complete: () => animated = false
        })
      }
    }
    else if(e.keyCode === 38){
      if(index !== 0 && !animated){
        animated = true
        goTo(window.scrollY, anchors[index - 1])
        .addListener({
          next: y => window.scrollTo(0, y)
        , error: x => console.error(x)
        , complete: () => animated = false
        })
      }
    }
    if(e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault()
      return false
    }
  }
, error: err => console.error(err)
, complete: () => console.log('complete')
})
