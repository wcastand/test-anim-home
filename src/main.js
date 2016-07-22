import xs from 'xstream'
import fromEvent from 'xstream/extra/fromEvent'
import debounce from 'xstream/extra/debounce'
import tween from 'xstream/extra/tween'

import styl from './app.styl'

let animated =
  false

const determineIndex =
  (a, offset = false) =>
    a.reduce((acc, x) => {
      return window.scrollY === 0
      ? acc
      : x.top + (offset ? x.height / 2 : 0) >= window.scrollY
        ? acc
        : acc + 1
    }, 0)

const goTo =
  (start, end) =>
    tween({
      from: start,
      to: end,
      ease: tween.power4.easeOut,
      duration: 1000, // milliseconds
    })

fromEvent(window, 'keydown')
.addListener({
  next: e => {
    e.preventDefault()
    const anchors = Array
      .from(document.querySelectorAll('section'))
      .map(section => ({ top: section.offsetTop, height: section.getBoundingClientRect().height }))
    const index = determineIndex(anchors)

    switch(e.keyCode){
      case 40:
        if(index !== anchors.length - 1 && !animated){
          animated = true
          goTo(window.scrollY, anchors[index + 1].top)
          .addListener({
            next: y => window.scrollTo(0, y)
          , error: x => console.error(x)
          , complete: () => animated = false
          })
        }
        return false
      case 38:
        if(index !== 0 && !animated){
          animated = true
          goTo(window.scrollY, anchors[index - 1].top)
          .addListener({
            next: y => window.scrollTo(0, y)
          , error: x => console.error(x)
          , complete: () => animated = false
          })
        }
        return false
      default:
        return true
    }
  }
, error: err => console.error(err)
, complete: () => console.log('complete')
})


fromEvent(window, 'wheel')
.compose(debounce(1500))
.addListener({
  next: e => {
    e.preventDefault()
    const anchors = Array
      .from(document.querySelectorAll('section'))
      .map(section => ({ top: section.offsetTop, height: section.getBoundingClientRect().height }))
    const index = determineIndex(anchors, true)
    if(!animated){
      animated = true
      goTo(window.scrollY, anchors[index].top)
      .addListener({
        next: y => window.scrollTo(0, y)
      , error: x => console.error(x)
      , complete: () => animated = false
      })
    }

  }
, error: err => console.error(err)
, complete: () => console.log('complete')
})
