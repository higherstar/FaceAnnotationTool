require('font-awesome/css/font-awesome.css');
require('./_loadingOverlay.css');
import React, {Component, PropTypes } from 'react';

class LoadingOverlay extends Component {
  render() {
    if (!this.props) {
      return null;
    }else{
      let providersList = [];
      if(this.props.providersList && this.props.providersList.length > 0) {
        this.props.providersList.forEach((provider, idx) => {
          let loaded = (provider.loaded === true) ? "loaded" : "";
          let icon = (provider.loaded === true) ? "fa-check" : "fa-spinner fa-spin-custom";
          providersList.push(
            <div key={`provider-loaded-row-${idx}`} className={`row ${loaded}`}>

              <h4><span className={`fa ${icon}`}></span> Now Searching: {provider.name}</h4>
            </div>
          );
        });
      }

      return (
        <div className={this.props.overlayClass}>
          <i className="fa fa-spinner fa-spin-custom" aria-hidden="true"></i>
          <h3>{this.props.message}</h3>
          <div className="loading-providers">
            {providersList}
          </div>
        </div>
      );
    }
  }
}

LoadingOverlay.propTypes = {
  overlayClass: PropTypes.string.isRequired,
  message: PropTypes.string
};

export default LoadingOverlay;
