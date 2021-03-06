import React from 'react';
import LoadingPlaceholder from 'react-loading-placeholder'

class Loading extends React.Component {
   render() {
      if (this.props.loading) {
         return <LoadingPlaceholder numberOfRows={this.props.row} spaceBetween={10}/>
      } else {
         return <div>{this.props.children}</div>
      }
   }
}

export default Loading