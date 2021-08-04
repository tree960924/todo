class App{
    constructor(){
        this.$app = document.querySelector('.app');
        this.$target = document.createElement('div');
        this.$target.className = 'todo_container';
        this.$app.appendChild(this.$target);
        this.state = {
            todoList : ['밥먹기', '일찍 자기', '공부하기'],
            memoList : ['알차게 밥먹기', '알차게 일찍 자기', '알차게 공부하기']
        }
        this.todoListView = new TodoListView(this.$target, this.state.todoList, this.onSelect);
        this.memoView = new MemoView(this.$target);
        this.todoInput = new TodoInput(this.$target, this.onAdd);
    }
   
    onSelect = (index)=>{
        console.log(index);
        this.memoView.setState({memo : this.state.memoList[index]})
    }

    onAdd = (todo, memo)=>{
        this.state.todoList.push(todo);
        this.state.memoList.push(memo);
        console.log(this.state.todoList);
        console.log(this.state.memoList);
        this.todoListView.setState({todoList:this.state.todoList});
    }
}

class TodoListView{
   constructor($parent, todoList, onSelect){
       this.$parent = $parent;
       this.state = {
           todoList : todoList
       };
       this.onSelect = onSelect;
       this.$target = document.createElement('ul');
       this.$target.className = 'todo_list_view';
       this.$parent.appendChild(this.$target);
       this.render();
       this.setEvent();
   }

   render(){
       if(this.state.todoList === undefined){
           this.$target.innerHTML = `
           등록된 Todo가 없습니다.
           `
       }
       else{
           console.log(this.state.todoList);
           this.$target.innerHTML = this.state.todoList.map((element, index)=>
               `<li data-index="${index}">
                    <input id="todo${index}" type="checkbox">
                    <label for="todo${index}">${element}</label>         
                </li>`
           ).join('');
       }
   }

   setEvent(){
       this.$target.addEventListener('click', (e)=>{
           let index = e.target.dataset.index;
           if(index){
               let prevSelected = this.$target.querySelector('li[selected]');
               if(prevSelected){
                   prevSelected.removeAttribute('selected');
               }
               e.target.setAttribute('selected', '');
               this.onSelect(index);
           }
       })
   }

   setState = (newState)=>{
        this.state = {...this.state, ...newState};
        this.render();
    }
}

class MemoView{
    constructor($parent, memo){
        this.$parent = $parent;
        this.$target = document.createElement('div');
        this.state = {};
        this.state.memo = memo;
        this.$target.className = 'memo_view';
        this.$parent.appendChild(this.$target);
        this.render();
    }

    render(){
        if(this.state.memo === undefined){
            this.$target.innerHTML = '';
        }
        else{
            this.$target.innerHTML = this.state.memo;
        }
    }

    setState = (newState)=>{
        this.state = {...this.state, ...newState};
        this.render();
    }
}

class TodoInput{
    constructor($parent, onAdd){
        this.$parent = $parent;
        this.onAdd = onAdd;
        this.$target = document.createElement('div');
        this.$target.className = 'todo_input';
        this.state = {};
        this.$parent.appendChild(this.$target);
        this.render();
        this.setEvent();
    }

    render(){
        this.$target.innerHTML = `
            <div class="input_group">
                <input class="input_todo" name="todo" type="text" required>
                <span class="bar"></span>
                <label>title</label>
            </div>
            <textarea class = "input_memo" name="memo" placeholder="context"></textarea>
            <button class="btn btn_add">+ add</button>
        `
    }

    setEvent(){
        this.$target.addEventListener('click', (e)=>{
            if(e.target.classList.contains('btn_add')){
                console.log(this);
                this.onAdd(this.state.todo, this.state.memo);
                
            }
        })
        this.$target.addEventListener('change', (e)=>{
            console.log(e.target);
            let inputcontent = e.target.name;
            this.state[inputcontent] = e.target.value;
        })
    }
}

class Component{
    constructor($parent, props){
        this.$parent = $parent;
        this.props = props;
    }

    setState = (newState)=>{
        this.state = {...this.state, ...newState};
        if(this.render !== undefined){
            this.render();
        }
        if(this.subComponent !== undefined){
            for(component in this.subComponent){
                this.subComponent[component].setProps(this.state);
            }
        }
    }

    setProps = (newProps) => {
        this.props = {...this.props, ...newProps};

        if(this.render !== undefined){
            this.render();
        }
    }
}

new App();

export default App;