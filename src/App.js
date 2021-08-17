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
            todoState : ['active', 'active', 'active'],
            selectedMemo : ''
        }
        this.todoListView = new TodoListView(this, {
            todoList : this.state.todoList, 
            todoState : this.state.todoState,
            onSelect : this.onSelect,
            onDelete : this.onDelete,
            onTodoStateChange : this.onTodoStateChange
        });
        this.memoView = new MemoView(this, {
            memo : this.state.selectedMemo
        });
        this.todoInput = new TodoInput(this, {
            onAdd : this.onAdd
        });
        console.log(this.state);
    }
   
    onSelect = (index)=>{
        this.setState({selectedMemo : this.state.memoList[index]});
    }

    onAdd = (todo, memo)=>{
        this.setState({
            todoList : [...this.state.todoList, todo],
            memoList : [...this.state.memoList, memo],
            todoState : [...this.state.todoState, 'active']
        })
        console.log(this.state);
    }

    onTodoStateChange = (index)=>{
        let toggled = this.state.todoState[index] === 'active' ? 'complete' : 'active';
        this.setState({
            todoState : [...this.state.todoState.slice(0, index), toggled, ...this.state.todoState.slice(index+1)]
        })
        console.log(this.state);
    }

    onDelete = (index)=>{
        console.log(index);
        this.setState({
            todoList : [...this.state.todoList.slice(0, index), ...this.state.todoList.slice(index+1)],
            memoList : [...this.state.memoList.slice(0, index), ...this.state.memoList.slice(index+1)],
            todoState : [...this.state.todoState.slice(0, index), ...this.state.todoState.slice(index+1)],
            selectedMemo : this.state.selectedMemo === this.state.memoList[index] ? "" : this.state.selectedMemo
        })
        console.log(this.state);
    }
}

class TodoListView extends Component{
    constructor(parent, props){
        super(parent, props);
        this.$target = document.createElement('div');
        this.$target.className = 'todo_list_view';
        this.$parent.appendChild(this.$target);
        this.state = {
            viewState : "all"
        }
        this.render();
        this.setEvent();
    }

    render(){
        console.log(this.props.todoState);
        const stateBtns = `<div class="stateBtns">
            <button class="btn toggleBtn" data-viewstate="all" ${this.state.viewState === "all" ? "toggled" : ""}>All</button>
            <button class="btn toggleBtn" data-viewstate="active" ${this.state.viewState === "active" ? "toggled" : ""}>Active</button>
            <button class="btn toggleBtn" data-viewstate="complete" ${this.state.viewState === "complete" ? "toggled" : ""}>Complete</button>
        </div>`
        const todoItem = (element, index) => {
            return `
            <li data-index="${index}" ${index === this.state.selectedIndex ? "selected" : ""}>
                <div class="todo">
                ${element}   
                </div>
                <div class="btn_group">
                    <input class="chk_btn" type="checkbox" ${this.props.todoState[index] === "complete" ? "checked" : ""}>
                    <button class="img_btn del_btn" data-delindex="${index}"></button>  
                </div>
                            
            </li>`
        }
        if(this.props.todoList === undefined){
            this.$target.innerHTML = `
            등록된 Todo가 없습니다.
            `
        }
        else{
            this.$target.innerHTML = stateBtns +
            `
            <ul class="todo_list">
            ${this.props.todoList.map((element, index) => {
                if(this.state.viewState === 'all'){
                    return todoItem(element, index);
                }
                else if(this.state.viewState === 'active'){
                    if(this.props.todoState[index] === 'active') return todoItem(element, index);
                }
                else if(this.state.viewState === 'complete'){
                    if(this.props.todoState[index] === 'complete') return todoItem(element, index);
                }
            }).join('')} 
            </ul>`
        }
    }

    setEvent(){
        this.$target.addEventListener('click', (e)=>{
            let index = e.target.dataset.index;
            if(index !== undefined){
                index = index*1;
                this.props.onSelect(index);
                this.setState({selectedIndex : index});
                console.log(this.state);
            }
        })
        this.$target.addEventListener('click', (e)=>{
            let viewState = e.target.dataset.viewstate;
            if(viewState){
                this.setState({viewState : viewState});
                console.log(this.state);
            }
        })
        this.$target.addEventListener('click', (e)=>{
            if(e.target.closest('.del_btn')){
                let delIndex = e.target.closest('.del_btn').dataset.delindex*1;
                if(this.state.selectedIndex === delIndex) this.setState({selectedIndex : -1});
                this.props.onDelete(delIndex);
            }
        })
        this.$target.addEventListener('change', (e)=>{
            let index = e.target.closest('li').dataset.index*1;
            this.props.onTodoStateChange(index);
        })
    }

    update(){
        this.setProps({
            todoList : this.parent.state.todoList,
            todoState : this.parent.state.todoState
        });
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