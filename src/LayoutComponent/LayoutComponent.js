
import { Component } from "react";
import TileComponent from "../TileComponent/TileComponent";
import tileimgs from "../TileComponent/tiles/tiles";
import "../App.css";

class LayoutComponent extends Component{
    constructor(props){
        super(props);
        this.deck = [...tileimgs];
        this.deck = this.shuffle(this.deck);
        this._ismounted = false;
        this.state = {
            deck: this.deck,
            layout: []
        }
        this.loadLayout();
    }

    componentDidMount(){
        this._ismounted = true;
    }

    componentWillUnmount(){
        this._ismounted = false;
    }
        
   shuffle = (array) => {
    var currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

        return array;
    }

    loadLayout = () => {
            fetch("./layout-traditional.json")
            .then((response) => {
                    return response.json();
            }).then(
                data => {
                    if(this._ismounted){
                        this.setState({
                            layout: data.layouts
                        });
                    }
                    // else{
                    //     this.state.layout = data.layouts
                    // }
                }
            );
    }

    itemBlocked = (l,r,i) => {
        // let message1,message2,message3;
        // message1 = this.blockedByLayer(l,r,i)?"blocked by layer":"not blocked by layer";
        // message2 = this.itemBlockedLeft(l,r,i)?"Blocked left":"not blocked left";
        // message3 = this.itemBlockedRight(l,r,i)?"Blocked right":"not blocked right";
        if(!this.blockedByLayer(l,r,i) && (!this.itemBlockedLeft(l,r,i) || !this.itemBlockedRight(l,r,i))){
            // alert(message1+"\n"+message2+"\n"+message3);
            return true;
        }
        else{
            // alert(message1+"\n"+message2+"\n"+message3);
            return false;
        }
    }

    itemBlockedRight = (l,r,i) => {
        let ind = this.state.layout[0][l][r].indexOf(i);
        let testedItem;
        let above = r-1;
        let below = r+1;
        for(let item = 0; item < this.state.layout[0][l][r].length; item++){
            testedItem = this.state.layout[0][l][r][item];
            if(this.state.layout[0][l][r][item] === this.state.layout[0][l][r][ind]+2){
                return true;
            }
        }
        if(above >= 0){
            for(let item = 0; item < this.state.layout[0][l][above].length; item++){
                testedItem = this.state.layout[0][l][above][item];
                if(this.state.layout[0][l][above][item] === this.state.layout[0][l][r][ind]+2){
                    return true;
                }
            }    
        }
        if(below <= this.state.layout[0][l].length-1){
            for(let item = 0; item < this.state.layout[0][l][below].length; item++){
                testedItem = this.state.layout[0][l][below][item];
                if(this.state.layout[0][l][below][item] === this.state.layout[0][l][r][ind]+2){
                    return true;
                }
            }    
        }
        return false;
    }
   
    itemBlockedLeft = (l,r,i) => {
        let ind = this.state.layout[0][l][r].indexOf(i);
        let testedItem;
        let above = r-1;
        let below = r+1;
        for(let item = 0; item < this.state.layout[0][l][r].length; item++){
            testedItem = this.state.layout[0][l][r][item];
            if(this.state.layout[0][l][r][item] === this.state.layout[0][l][r][ind]-2){
                return true;
            }
        }
        if(above >= 0){
            for(let item = 0; item < this.state.layout[0][l][above].length; item++){
                testedItem = this.state.layout[0][l][above][item];
                if(this.state.layout[0][l][above][item] === this.state.layout[0][l][r][ind]-2){
                    return true;
                }
            }    
        }
        if(below <= this.state.layout[0][l].length-1){
            for(let item = 0; item < this.state.layout[0][l][below].length; item++){
                testedItem = this.state.layout[0][l][below][item];
                if(this.state.layout[0][l][below][item] === this.state.layout[0][l][r][ind]-2){
                    return true;
                }
            }    
        }
        return false;
    }

    blockedByLayer = (l,r,i) => {
        let ind = this.state.layout[0][l][r].indexOf(i);
        let blockby = 0;
        

        let testLayer = l + 1;
        if(this.state.layout[0].length > testLayer) {// there exists a higher level
            if(typeof(this.state.layout[0][testLayer][r]) !== 'undefined'){ // row directly above exists

                if(
                    this.state.layout[0][testLayer][r].indexOf(i) !== -1 || // tile directly above
                    this.state.layout[0][testLayer][r].indexOf(i-1) !== -1 || // tile above offset by minus half a tile
                    this.state.layout[0][testLayer][r].indexOf(i+1) !== -1){ // tile above offest by half a tile
                        blockby = 1;
                }
            }
            if(typeof(this.state.layout[0][testLayer][r-1]) !== 'undefined'){ // row directly above exists
                if(
                    this.state.layout[0][testLayer][r-1].indexOf(i) !== -1 || // tile directly above
                    this.state.layout[0][testLayer][r-1].indexOf(i-1) !== -1 || // tile above offset by minus half a tile
                    this.state.layout[0][testLayer][r-1].indexOf(i+1) !== -1){ // tile above offest by half a tile
                        blockby = 2;
                }
            }
            if(typeof(this.state.layout[0][testLayer][r+1]) !== 'undefined'){ // row directly above exists
                if(
                    this.state.layout[0][testLayer][r+1].indexOf(i) !== -1 || // tile directly above
                    this.state.layout[0][testLayer][r+1].indexOf(i-1) !== -1 || // tile above offset by minus half a tile
                    this.state.layout[0][testLayer][r+1].indexOf(i+1) !== -1){ // tile above offest by half a tile
                        blockby = 3;
                }
            }
        }
        if(blockby > 0){
            // alert(blockby);
            return true;
        }
        else{
            return false;
        }
    }

    render(){
        let tileslayout = [];
        let x,y,c = 0;
        let lo = this.state.layout;
        if(lo.length > 0){
            for(let l = 0; l < lo[0].length;l++)
                for(let r = 0; r < lo[0][l].length; r++){
                    for(let i = 0; i < lo[0][l][r].length; i++){
                        if(lo[0][l][r][i] !== null){
                            x = ((lo[0][l][r][i])*20)+(l*4);
                            y = (r*25)+(l*4);
                            const height = 50;
                            const width = 40;
                            tileslayout[c] = <TileComponent itemBlocked={this.itemBlocked} deck={this.deck} key={"tile"+c} tileno={c} x={x} y={y} height={height} width={width} layer={l} row={r} item={lo[0][l][r][i]}></TileComponent>
                            c++;
                        }
                    }
                }
            return (
                <div className="boardcontainer">
                {tileslayout.map((item,i) => {
                    return item
                })}
            </div>);
        }
        else{
            return <div className="boardcontainer"></div>
        }
    }
}

export default LayoutComponent;
