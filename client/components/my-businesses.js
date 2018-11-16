import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchMyBusinessData} from '../store'
import {Link} from 'react-router-dom'
class MyBusinesses extends Component {
  componentDidMount() {
    this.props.fetchMyBusinessData()
  }
  render() {
    const {myBusinesses} = this.props

    // if isLoading value is true -> loading msg
    if (myBusinesses.isLoading) {
      return (
        <div>
          <h1>My Businesses</h1>
          <div>Loading...</div>
        </div>
      )
    }
    // else render returned data
    if (myBusinesses.businessData.hasOwnProperty('entities')) {
      const {entities, result} = myBusinesses.businessData
      return (
        <div>
          <h1>My Businesses</h1>
          <div>
            {result.map(businessId => {
              const business = entities.businesses[businessId]
              return (
                <div key={business.id}>
                  <Link to={`/my-businesses/${business.id}`}>
                    <h1>{business.name}</h1>
                  </Link>
                  <h2>Business ID: {business.id}</h2>
                  <h2>
                    Queue Length:{' '}
                    {business.queues.length
                      ? entities.queues[business.queues[0]].queueLength
                      : 'Not found'}
                  </h2>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
  }
}

const mapState = state => ({
  myBusinesses: state.myBusinesses
})

const mapDispatch = dispatch => ({
  fetchMyBusinessData: () => dispatch(fetchMyBusinessData())
})

export default connect(mapState, mapDispatch)(MyBusinesses)