
import { Component, createRef } from "react";
import TileComponent from "../TileComponent/TileComponent";
import tileimgs from "../TileComponent/tiles/tiles";
import "../App.css";

class LayoutComponent extends Component{
    constructor(props){
        super(props);
        this.deck = [...tileimgs];
        this.deck = this.shuffle(this.deck);
        this._ismounted = false;
        this.tileRefs = [];
        for(let i = 0; i < this.deck.length; i++)
            this.tileRefs[i] = createRef(null);
        this.state = {
            deck: this.deck,
            selected: null,
            layout: [],
            tilenoLayout: [],
            tileLayout: []
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
                        let tilenoLayout = JSON.parse(JSON.stringify(data.layouts[0]));
                        let tileLayout = JSON.parse(JSON.stringify(data.layouts[0]));
                        let c = 0;
                        for(let ls = 0; ls < data.layouts.length; ls++){
                            for(let l = 0; l < data.layouts[0].length; l++){
                                for(let r = 0;r < data.layouts[0][l].length; r++){
                                    if(tilenoLayout[ls][l][r]!==null){
                                        for(let i=0;i<data.layouts[0][l][r].length; i++){
                                            if(tileLayout[l][r][i] !== null){
                                                tileLayout[l][r][i] = {
                                                    position: tileLayout[l][r][i],
                                                    index: i,
                                                    tile: this.deck[c]
                                                }
                                                c++;
                                            }
                                            else{
                                                tileLayout[l][r][i] = null;
                                            }
                                        }
                                        tilenoLayout[ls][l][r] = c;
                                        // c++;
                                    }
                                }
                            }
                        }
                        this.setState({
                            layout: data.layouts,
                            tilenoLayout: tilenoLayout,
                            tileLayout: tileLayout
                        });
                    }
                }
            );
    }

    getCard = (l,r,i) => {
        let ii = 0;
        for(let li = 0; li <= l; li++){
            for(let ri = 0; ri <= r; ri++){
                ii++
            }
        }
        ii += i;
        return ii;
    }

    removeTile = (l,r,i,c) => {
        let ii = this.state.tileLayout[l][r].indexOf(i);
        
        let tmpLayout = JSON.parse(JSON.stringify(this.state.tileLayout));
        tmpLayout[l][r][i.index] = null;
        this.setState({tileLayout: tmpLayout});
    }

    itemBlocked = (l,r,i,c) => {
        if(!this.blockedByLayer(l,r,i) && (!this.itemBlockedLeft(l,r,i) || !this.itemBlockedRight(l,r,i))){
            let layoutCopy = this.removeTile(l,r,i,c);
            return true;
        }
        else{
            return false;
        }
    }

    itemBlockedRight = (l,r,i) => {
        let toTheRight = i.position+2;
        let blockedby = 0;
        // blocked on this exact row
        for(let idx = 0;idx < this.state.tileLayout[l][r].length; idx++){
            if(this.state.tileLayout[l][r][idx] !== null){
                if(this.state.tileLayout[l][r][idx].position === toTheRight){
                    blockedby += 1;
                }
            }
        }

        // blocked by half a row above
        if(r>0){
            if(typeof(this.state.tileLayout[l][r-1]) !== 'undefined'){
                if(this.state.tileLayout[l][r-1].length === 1 && this.state.tileLayout[l][r-1][0] !== null){ //row is there and not empty
                    if(this.state.tileLayout[l][r-1][0].position === toTheRight){
                        blockedby += 1;
                    }
                    else if(this.state.tileLayout[l][r-1].length === 1 && this.state.tileLayout[l][r-1][0] === null){
                        blockedby += 0;
                    }
                    else if(this.state.tileLayout[l][r-1].length > 1){
                        for(let idx = 0; idx < this.state.tileLayout[l][r-1].length; idx++){
                            if(this.state.tileLayout[l][r-1][idx].position === toTheRight){
                                blockedby += 1;
                            }
                        }
                    }
                    else if(this.state.tileLayout[l][r-1].length === 0){
                        blockedby += 0;
                    }
                }
            }
        }

        if(typeof(this.state.tileLayout[l][r+1]) !== 'undefined'){
            if(this.state.tileLayout[l][r+1].length === 1 && this.state.tileLayout[l][r+1][0] !== null){ //row is there and not empty
                if(this.state.tileLayout[l][r+1][0].position === toTheRight){
                    blockedby += 1;
                }
                else if(this.state.tileLayout[l][r+1].length === 1 && this.state.tileLayout[l][r+1][0] === null){
                    blockedby += 0;
                }
                else if(this.state.tileLayout[l][r+1].length > 1){
                    for(let idx = 0; idx < this.state.tileLayout[l][r+1].length; idx++){
                        if(this.state.tileLayout[l][r+1][idx].position === toTheRight){
                            blockedby += 1;
                        }
                    }
                }
                else if(this.state.tileLayout[l][r+1].length === 0){
                    blockedby += 0;
                }
            }
        }

        if(blockedby >0){
            return true;
        }
        else{
            return false;
        }
    }
   
    itemBlockedLeft = (l,r,i) => {
        let toTheLeft = i.position-2;
        let blockedby = 0;
        // blocked on this exact row
        for(let idx = 0;idx < this.state.tileLayout[l][r].length; idx++){
            if(this.state.tileLayout[l][r][idx] !== null){
                if(this.state.tileLayout[l][r][idx].position === toTheLeft){
                    blockedby += 1;
                }
            }
        }

        // blocked by half a row above
        if(r>0){
            if(typeof(this.state.tileLayout[l][r-1]) !== 'undefined'){
                if(this.state.tileLayout[l][r-1].length === 1 && this.state.tileLayout[l][r-1][0] !== null){ //row is there and not empty
                    if(this.state.tileLayout[l][r-1][0].position === toTheLeft){
                        blockedby += 1;
                    }
                    else if(this.state.tileLayout[l][r-1].length === 1 && this.state.tileLayout[l][r-1][0] === null){
                        blockedby += 0;
                    }
                    else if(this.state.tileLayout[l][r-1].length > 1){
                        for(let idx = 0; idx < this.state.tileLayout[l][r-1].length; idx++){
                            if(this.state.tileLayout[l][r-1][idx].position === toTheLeft){
                                blockedby += 1;
                            }
                        }
                    }
                    else if(this.state.tileLayout[l][r-1].length === 0){
                        blockedby += 0;
                    }
                }
            }
        }

        if(typeof(this.state.tileLayout[l][r+1]) !== 'undefined'){
            if(this.state.tileLayout[l][r+1].length === 1 && this.state.tileLayout[l][r+1][0] !== null){ //row is there and not empty
                if(this.state.tileLayout[l][r+1][0].position === toTheLeft){
                    blockedby += 1;
                }
                else if(this.state.tileLayout[l][r+1].length === 1 && this.state.tileLayout[l][r+1][0] === null){
                    blockedby += 0;
                }
                else if(this.state.tileLayout[l][r+1].length > 1){
                    for(let idx = 0; idx < this.state.tileLayout[l][r+1].length; idx++){
                        if(this.state.tileLayout[l][r+1][idx].position === toTheLeft){
                            blockedby += 1;
                        }
                    }
                }
                else if(this.state.tileLayout[l][r+1].length === 0){
                    blockedby += 0;
                }
            }
        }

        if(blockedby >0){
            return true;
        }
        else{
            return false;
        }
    }

    blockedByLayer = (l,r,i) => {
        const testLayer = l+1;
        if(this.state.tileLayout.length === testLayer){
            return false;
        }
        const leftObscurred = i.position < 1? 0: i.position-1;
        const centerObscurred = i.position;
        const rightObscurred = i.position + 1;
        let blockedby = 0;

        if(typeof(this.state.tileLayout[testLayer][r]) !== 'undefined'){ // row directly above
            for(let idx = 0; idx < this.state.tileLayout[testLayer][r].length; idx++){
                if(this.state.tileLayout[testLayer][r][idx] !== null){
                    if(this.state.tileLayout[testLayer][r][idx].position === leftObscurred){
                        blockedby = 1;
                    }
                    if(this.state.tileLayout[testLayer][r][idx].position === centerObscurred){
                        blockedby = 1;
                    }
                    if(this.state.tileLayout[testLayer][r][idx].position === rightObscurred){
                        blockedby = 1;
                    }
                }
            }
        }
        if(typeof(this.state.tileLayout[testLayer][r-1]) !== 'undefined'){ // row overlapping above
            for(let idx = 0; idx < this.state.tileLayout[testLayer][r-1].length; idx++){
                if(this.state.tileLayout[testLayer][r-1][idx] !== null){
                    if(this.state.tileLayout[testLayer][r-1][idx].position === leftObscurred){
                        blockedby = 1;
                    }
                    if(this.state.tileLayout[testLayer][r-1][idx].position === centerObscurred){
                        blockedby = 1;
                    }
                    if(this.state.tileLayout[testLayer][r-1][idx].position === rightObscurred){
                        blockedby = 1;
                    }
                }
            }
        }
        if(typeof(this.state.tileLayout[testLayer][r+1]) !== 'undefined'){ // row overlapping below
            for(let idx = 0; idx < this.state.tileLayout[testLayer][r+1].length; idx++){
                if(this.state.tileLayout[testLayer][r+1][idx] !== null){
                    if(this.state.tileLayout[testLayer][r+1][idx].position === leftObscurred){
                        blockedby = 1;
                    }
                    if(this.state.tileLayout[testLayer][r+1][idx].position === centerObscurred){
                        blockedby = 1;
                    }
                    if(this.state.tileLayout[testLayer][r+1][idx].position === rightObscurred){
                        blockedby = 1;
                    }
                }
            }
        }
        if(blockedby > 0)
            return true;
        else
            return false;
    }

    render(){
        let c = 0;
        let deck = JSON.parse(JSON.stringify(this.state.deck));
        if(this.state.layout.length > 0){
            let lo = JSON.parse(JSON.stringify(this.state.layout[0]));
            let lo2 = JSON.parse(JSON.stringify(this.state.tileLayout));
            return(
                <div className="boardcontainer" id="blarg">
                {lo2.map((itemLayer,l) => {
                    return itemLayer.map((itemRow,r) => {
                        return itemRow.map((item,i) => {
                            if(item !== null){
                                if(item.tile.image !== null && item.position !== null){
                                    let ctmp = c;
                                    c++;
                                    let x = (item.position*20)+l*4;
                                    let y = (r*25)+(l*4);
                                    const height = 50;
                                    const width = 40;
                                    return <TileComponent ref={(element) => this.tileRefs[ctmp] = element} itemBlocked={this.itemBlocked} deck={this.deck} key={"tile"+ctmp} tileno={ctmp} x={x} y={y} height={height} width={width} layer={l} row={r} item={item}></TileComponent>
                                }
                            }
                        })
                    })
                })}
                </div>
            )
        }
        else{
            return <div className="boardcontainer"></div>
        }
    }
}

export default LayoutComponent;
