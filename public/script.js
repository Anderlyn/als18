
class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isItLoading: false,
            code: "",
            stateMessage: "Escribe tu código.",
            isLetterActive: false,
            letterContent: {
                content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                person: "André",
                link: "https://www.youtube.com/watch?v=IPXIgEAGe4U",
                special: true
            }
        }
        this.updateCode = this.updateCode.bind(this);
    }
    sendCode(){
        this.setState({
            isItLoading: true
        });
        let temporalCode = {
            code: this.state.code
        }
        fetch("https://us-central1-als-18.cloudfunctions.net/checkCard/code",{
            method: "POST",
            body: JSON.stringify(temporalCode),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            } 
        })
        .then(v =>{
            v.json().then(letter => {
                if(letter.error){
                    this.setState({
                        isItLoading: false,
                        stateMessage: letter.message,
                    });
                }else{
                    let body = document.getElementsByTagName("body");
                    if(letter.data.special){
                        body[0].style.animation= "backgroundSpecial 1s forwards";
                    }else{
                        body[0].style.animation= "backgroundNormal 1s forwards";
                    }
                    this.setState({
                        isItLoading: false,
                        isLetterActive: true,
                        letterContent: letter.data
                    });
                }
            })
        })
    }
    updateCode(event){
        this.setState({code: event.target.value});
    }
    render(){
        return(
            <div id='index'  style={{display: "grid"}}>
                <div style={{display: ""}}  id='code' className={this.state.isLetterActive ? "cardCheck" : ""}>
                    <h1 id='name' data-shadow='Als18'>Als18</h1>
                    <h1 id='title'>{this.state.stateMessage}</h1>
                    <input 
                    value={this.state.code} 
                    maxlength="5" 
                    onChange={this.updateCode}
                    className={this.state.isItLoading ? "loadingInput" : ""}></input><br/>
                    <button disabled={this.state.isItLoading} onClick={()=>this.sendCode()}>Vamos.</button>
                </div>
                <div  id='card' style={{display: this.state.isLetterActive ? "" : "none"}}>
                    <h1 id='name'>{this.state.letterContent.person}</h1>
                    <p> 
                        {this.state.letterContent.content}
                    </p>
                    <a style={{display: this.state.letterContent.link ? "" : "none"}} target='_blank' href={this.state.letterContent.link}>Una canción para ti</a>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));