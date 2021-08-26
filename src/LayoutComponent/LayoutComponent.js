
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
                            tileslayout[c] = <TileComponent deck={this.deck} key={"tile"+c} tileno={c} x={x} y={y} height={height} width={width} layer={l} row={r} item={i}></TileComponent>
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
