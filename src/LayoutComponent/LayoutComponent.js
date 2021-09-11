
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
                console.log("loadLayout: ",this.deck);
                   if(this._ismounted){
                        let tilenoLayout = JSON.parse(JSON.stringify(data.layouts[0]));
                        let tileLayout = JSON.parse(JSON.stringify(data.layouts[0]));
                        let c = 0;
                        for(let ls = 0; ls < data.layouts.length; ls++){
                            for(let l = 0; l < data.layouts[0].length; l++){
                                for(let r = 0;r < data.layouts[0][l].length; r++){
                                    if(tilenoLayout[ls][l][r]!==null){
                                        for(let i=0;i<data.layouts[0][l][r].length; i++){
                                            console.log("loadLayout: ",{
                                                position: tileLayout[l][r][i],
                                                tile: this.deck[c],
                                                c: c
                                            })
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
                        console.log("loadLayout: ",tileLayout);

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
        console.log("\n\n\n\n\ni:",i);
        // console.log("the card: ",this.state.deck[ii]);

        // let deck = JSON.parse(JSON.stringify(this.deck));
        // this.deck[ii] = null;
        
        let tmpLayout = JSON.parse(JSON.stringify(this.state.tileLayout));
        tmpLayout[l][r][i.index] = null;
        console.log("removeTile: ", tmpLayout);
        this.setState({tileLayout: tmpLayout});
    }

    itemBlocked = (l,r,i,c) => {
        // let message1,message2,message3;
        // message1 = this.blockedByLayer(l,r,i)?"blocked by layer":"not blocked by layer";
        // message2 = this.itemBlockedLeft(l,r,i)?"Blocked left":"not blocked left";
        // message3 = this.itemBlockedRight(l,r,i)?"Blocked right":"not blocked right";
        // let layoutCopy = [...this.state.layout];
        if(!this.blockedByLayer(l,r,i) && (!this.itemBlockedLeft(l,r,i) || !this.itemBlockedRight(l,r,i))){
            // console.log("Pre - layoutCopy=",layoutCopy);

            let layoutCopy = this.removeTile(l,r,i,c);
            // this.setState({deck: layoutCopy});
            // console.log("Post - layoutCopy=",this.state.layout);
            // this.forceUpdate();
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
        // console.log("render: ",this.state.layout);
        let c = 0;
        let deck = JSON.parse(JSON.stringify(this.state.deck));
//        console.log("render: ",this.state.tilenoLayout);
        if(this.state.layout.length > 0){
            let lo = JSON.parse(JSON.stringify(this.state.layout[0]));
            let lo2 = JSON.parse(JSON.stringify(this.state.tileLayout));
            return(
                <div className="boardcontainer" id="blarg">
                {lo2.map((itemLayer,l) => {
                    return itemLayer.map((itemRow,r) => {
                        return itemRow.map((item,i) => {
                            if(item !== null){
                                // console.log("render: ",item);
                                if(item.tile.image !== null && item.position !== null){
                                    // console.log("render: ",item);
                                    let ctmp = c;
                                    // ctmp = this.state.tilenoLayout[l][r][i];
                                    c++;
                                    // console.log("render: ",this.deck[ctmp]);
                                    let x = (item.position*20)+l*4;
                                    let y = (r*25)+(l*4);
                                    const height = 50;
                                    const width = 40;
                                    // console.log("render: ", {
                                    //     tileRef: this.tileRefs[ctmp],
                                    //     deck: this.deck,
                                    //     key: "tile"+ctmp,
                                    //     x: x,
                                    //     y: y,
                                    //     height: height,
                                    //     width: width,
                                    //     l: l,
                                    //     r: r,
                                    //     i: i
                                    // });
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

        // let tileslayout = [];
        // let x,y,c = 0;
        // let lo = this.state.layout;
        // let tilenumber;
        // console.log(this.state.tilenoLayout);
        // if(lo.length > 0){
        //     for(let l = 0; l < lo[0].length;l++)
        //         for(let r = 0; r < lo[0][l].length; r++){
        //             for(let i = 0; i < lo[0][l][r].length; i++){
        //                 if(lo[0][l][r][i] !== null){
        //                     x = ((lo[0][l][r][i])*20)+(l*4);
        //                     y = (r*25)+(l*4);
        //                     tilenumber = this.state.tilenoLayout[l][r][i];
        //                     const height = 50;
        //                     const width = 40;
        //                     // console.log("x:"+x+"\ny:"+y);
        //                     tileslayout[c] = <TileComponent ref={(element) => this.tileRefs[c] = element} itemBlocked={this.itemBlocked} deck={this.deck} key={"tile"+c} tileno={c} x={x} y={y} height={height} width={width} layer={l} row={r} item={lo[0][l][r][i]}></TileComponent>
        //                     c++;
        //                 }
        //             }
        //         }
        //     return (
        //         <div className="boardcontainer">
        //         {tileslayout.map((item,i) => {
        //             console.log(item);
        //             return item
        //         })}
        //     </div>);
        // }
        // else{
        //     return <div className="boardcontainer"></div>
        // }
    }
}

export default LayoutComponent;
