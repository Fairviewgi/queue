import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {Navbar, Footer, Categories} from './index'
const mapStyles = {
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
}

const mapState = state => ({
  isFilterVisible: state.categories.isFilterVisible
})

class CurrentLocation extends React.Component {
  constructor(props) {
    super(props)
    const {lat, lng} = this.props.initialCenter
    this.state = {
      currentLocation: {
        lat: lat,
        lng: lng
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap()
    }
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap()
    }
  }

  recenterMap() {
    const map = this.map
    const current = this.state.currentLocation

    const google = this.props.google
    const maps = google.maps

    if (map) {
      let center = new maps.LatLng(current.lat, current.lng)
      map.panTo(center)
    }
  }

  componentDidMount() {
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const coords = pos.coords
          this.setState({
            currentLocation: {
              lat: coords.latitude,
              lng: coords.longitude
            }
          })
        })
      }
    }
    this.loadMap()
  }

  loadMap() {
    if (this.props && this.props.google) {
      // checks if google is available
      const {google} = this.props
      const maps = google.maps

      const mapRef = this.refs.map

      // reference to the actual DOM element
      const node = ReactDOM.findDOMNode(mapRef)

      let {zoom} = this.props
      const {lat, lng} = this.state.currentLocation
      const center = new maps.LatLng(lat, lng)
      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: zoom
        }
      )

      // maps.Map() is constructor that instantiates the map
      this.map = new maps.Map(node, mapConfig)
    }
  }

  renderChildren() {
    const {children} = this.props

    if (!children) return

    return React.Children.map(children, c => {
      if (!c) return
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation
      })
    })
  }

  render() {
    const style = Object.assign({}, mapStyles.map)
    return (
      <React.Fragment>
        <Navbar />
        <div className="insideFrame">
          <div className="container">
            {this.props.isFilterVisible && <Categories />}
          </div>
          <div className="map" style={style} ref="map">
            Loading map...
            {this.renderChildren()}
          </div>
        </div>
        <Footer />
      </React.Fragment>
    )
  }
}

CurrentLocation.defaultProps = {
  zoom: 12, // 18 seems like the sweet spot for zoom
  initialCenter: {
    lat: 41.8953339,
    lng: -87.6390289
  },
  centerAroundCurrentLocation: false,
  visible: true
}

export default connect(mapState)(CurrentLocation)
