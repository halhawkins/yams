import { Component,createRef } from "react";
import {mask} from "./tiles/tiles";

class TileComponent extends Component{
    constructor(props){
        super(props);
        this.deck = this.props.deck;// [...tileimgs];
        this.tilediv = createRef(null);
        this.tileimg = createRef(null);
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
    
    getTileNo = () => {
        return this.props.tileno;
    }

    updateLayout = (lo) => {
        this.setState({});
    }

    isblocked = () => {
        if(this.props.itemBlocked(this.props.layer,this.props.row,this.props.item,this.state.tileno)){
            if(document.getElementById("tilemask")){
                document.getElementById("tilemask").remove();
            }
            if(!this.state.selected){
                this.tilediv.current.innerHTML = this.tilediv.current.innerHTML + "<img id=\"tilemask\" src=\"" + mask + "\" class=\"tileImage\" style=\"left:0;top:0;height:" + this.state.height + "px; width:" + this.state.width + "px;\">";
                this.setState({selected: true});
            }
            else{
                this.setState({selected: false});
            }
        }
    }

    selectable = () => {
        return false;
    }

    render = () => {
        let tilestyle = {
            left: this.props.x+"px",
            top: this.props.y+"px",
            height: this.state.height,
            width: this.state.width
        }
        let imgstyle = {
            height: this.state.height,
            width: this.state.width
        }
        return <div className="tile" style={tilestyle} onClick={this.isblocked} ref={this.tilediv}><img ref={this.tileimg} className="tileImage" src={this.props.item.tile.image} style={imgstyle} alt={this.props.item.tile.tile} title={this.props.item.tile.tile}/></div>
    }
}

export default TileComponent;