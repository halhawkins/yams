import { Component } from "react";

class TileComponent extends Component{
    constructor(props){
        super(props);
        this.deck = this.props.deck;// [...tileimgs];
        this.state = {
            tileno: this.props.tileno,
            deck: this.props.deck,
            layer: 0,
            selected: false,
            x: this.props.x,
            y: this.props.y,
            covered: false,
            rightTile: null,
            leftTile: null,
            height: this.props.height,
            width: this.props.width,
            coveredCallback: null
        };
    }

    selectable = () => {
        return false;
    }

    render = () => {
        let tilestyle = {
            left: this.state.x+"px",
            top: this.state.y+"px",
            height: this.state.height,
            width: this.state.width
        }
        let imgstyle = {
            // left: this.state.x+"px",
            // top: this.state.y+"px",
            height: this.state.height,
            width: this.state.width
        }
        return <div className="tile" style={tilestyle}><img className="tileImage" src={this.state.deck[this.state.tileno].image} style={imgstyle} alt={this.state.deck[this.state.tileno].tile} title={this.state.deck[this.state.tileno].tile}/></div>
    }
}

export default TileComponent;