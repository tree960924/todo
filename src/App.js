class Component{
	constructor(parent, props){
		this.parent = parent;
        if(this.parent !== undefined){
            this.$parent = this.parent.$target;
            this.parent.components.push(this);
        }
		this.components = [];
		this.props = props;
        this.state = {};
	}
	
	setState = (newState) => {
		this.state = {...this.state, ...newState}
		if(this.components.length > 0){
			for(let component of this.components){
				component.update();
			}
		}
		this.render();
	}

	setProps = (newProps) => {
		this.props = {...this.props, ...newProps};
		this.render();
	}

    render(){}

	update(){
		//각 컴포넌트들에서 구현
		//부모의 클래스를 참조하여 필요한 값을 가져오는 풀링 방식
		//가져온 이후 setProps로 props 갱신
	}
}
	

class App extends Component{
    constructor(){
        super();
        this.$app = document.querySelector('.app');
        this.$target = document.createElement('div');
        this.$target.className = 'todo_container';
        this.$app.appendChild(this.$target);
        this.state = {
            todoList : ['밥먹기', '일찍 자기', '공부하기'],
            memoList : ['알차게 밥먹기', '알차게 일찍 자기', '알차게 공부하기'],
            selectedMemo : ''
        }
        this.todoListView = new TodoListView(this, {
            todoList : this.state.todoList, 
            onSelect : this.onSelect
        });
        this.memoView = new MemoView(this, {
            memo : this.state.selectedMemo
        });
        this.todoInput = new TodoInput(this, {
            onAdd : this.onAdd
        });
    }
   
    onSelect = (index)=>{
        this.setState({selectedMemo : this.state.memoList[index]});
    }

    onAdd = (todo, memo)=>{
        this.setState({
            todoList : [...this.state.todoList, todo],
            memoList : [...this.state.memoList, memo]
        })
        console.log(this.state);
    }
}

class TodoListView extends Component{
   constructor(parent, props){
       super(parent, props);
       this.$target = document.createElement('ul');
       this.$target.className = 'todo_list_view';
       this.$parent.appendChild(this.$target);
       this.render();
       this.setEvent();
   }

   render(){
       if(this.props.todoList === undefined){
           this.$target.innerHTML = `
           등록된 Todo가 없습니다.
           `
       }
       else{
           this.$target.innerHTML = this.props.todoList.map((element, index)=>
               `<li data-index="${index}" ${index === this.state.selectedIndex && "selected"}>
                    <input id="todo${index}" type="checkbox">
                    <label for="todo${index}">${element}</label>         
                </li>`
           ).join('');
       }
   }

   setEvent(){
       this.$target.addEventListener('click', (e)=>{
           let index = e.target.dataset.index*1;
           if(index >= 0){
               this.props.onSelect(index);
               this.setState({selectedIndex : index});
               console.log(this.state);
           }
       })
   }

   update(){
       console.log('todoListView update called');
       this.setProps({todoList : this.parent.state.todoList});
   }
}

class MemoView extends Component{
    constructor(parent, props){
        super(parent, props);
        this.$target = document.createElement('div');
        this.$target.className = 'memo_view';
        this.$parent.appendChild(this.$target);
        this.render();
    }

    render(){
        if(this.props.memo === undefined){
            this.$target.innerHTML = '';
        }
        else{
            this.$target.innerHTML = this.props.memo;
        }
    }

    update(){
        this.setProps({memo : this.parent.state.selectedMemo});
    }
}

class TodoInput extends Component{
    constructor(parent, props){
        super(parent, props);
        this.$target = document.createElement('div');
        this.$target.className = 'todo_input';
        this.$parent.appendChild(this.$target);
        this.state = {
            todo : '',
            memo : ''
        };
        this.render();
        this.setEvent();
    }

    render(){
        this.$target.innerHTML = `
            <div class="input_group">
                <input class="input_todo" name="todo" value = "${this.state.todo}"type="text" required>
                <span class="bar"></span>
                <label>title</label>
            </div>
            <textarea class = "input_memo" name="memo" placeholder="context">${this.state.memo}</textarea>
            <button class="btn btn_add">+ add</button>
        `
    }

    setEvent(){
        this.$target.addEventListener('click', (e)=>{
            if(e.target.classList.contains('btn_add')){
                this.props.onAdd(this.state.todo, this.state.memo);
                this.setState({todo : '', memo : ''});
            }
        })
        this.$target.addEventListener('change', (e)=>{
            let inputcontent = e.target.name;
            //this.setState({[inputcontent] : e.target.value});
            this.state[inputcontent] = e.target.value;
            console.log(this.state);
        })
    }
}

new App();

export default App;