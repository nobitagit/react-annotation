import React from "react"
import PropTypes from "prop-types"

const events = {
  mouse: {
    start: "mousedown",
    move: "mousemove",
    stop: "mouseup"
  },
  touch: {
    start: "touchstart",
    move: "touchemove",
    stop: "touchend"
  }
}

export default class Handle extends React.Component {
  render() {
    const {
      x = 0,
      y = 0,
      r = 10,
      handleStart,
      handleDrag,
      handleStop
    } = this.props

    const makeHandler = type => {
      return e => {
        e.preventDefault()

        const xDim = "clientX"
        const yDim = "clientY"
        const oX = e.nativeEvent[xDim]
        const oY = e.nativeEvent[yDim]
        let x = oX
        let y = oY

        handleStart()

        const move = d => {
          d.preventDefault()
          handleDrag(d, {
            deltaX: d[xDim] - x,
            deltaY: d[yDim] - y,
            oDeltaX: d[xDim] - oX,
            oDeltaY: d[yDim] - oY
          })

          x = d[xDim]
          y = d[yDim]
        }

        document.addEventListener(events[type].move, move)
        document.addEventListener(events[type].stop, e => {
          e.preventDefault()
          document.removeEventListener(events[type].move, move)
          document.removeEventListener(events[type].stop, move)
          handleStop()
        })
      }
    }

    return (
      <circle
        className="handle"
        cx={x}
        cy={y}
        r={r}
        onMouseDown={makeHandler("mouse")}
        strokeDasharray="5"
        stroke="grey"
        fill="white"
        ref={handle => {
          this.handle = handle
        }}
        fillOpacity={0}
      />
    )
  }
}

Handle.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  r: PropTypes.number,
  handleStart: PropTypes.func,
  handleStop: PropTypes.func,
  handleDrag: PropTypes.func
}
