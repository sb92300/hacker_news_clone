const container = document.getElementById('root');
// ajax 통신 => get으로 api 받아오기 => api JSON을 이용해 값 쓰기 쉽게 만들기 => 필요한 요소를 만들어 쓰기
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
//바뀔 가능성이 있는 주소 등의 요소는 변수로 만들어주는 것이 좋다.
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

const store = {
    currentPage: 1,
};

function getData(url) {
    //get 방식, api 주소, true=비동기적으로, false=동기적으로 값을 가져오겠다.
    ajax.open('GET', url, false);
    //send 명령어가 있어야 실제로 값을 가져옴. => ajax.response;
    ajax.send();
    return JSON.parse(ajax.response);
}

function newsFeed() {
    const newsFeed = getData(NEWS_URL);
    const newsList = [];
    let template = ` 
        <div>
            <h1>Hacker News</h1>
            <ul>
                {{__news_feed__}}
            </ul>
            <div>
                <a href="#/page/{{__prev_page__}}">이전 페이지</a>
                <a href="#/page/{{__next_page__}}">다음 페이지</a>
            </div>
        </div>
    `;
    for(let i = (store.currentPage -1) * 10; i < store.currentPage * 10; i++) {
   newsList.push(`
        <li>
            <a href="#/show/${newsFeed[i].id}">
                ${newsFeed[i].title} - (${newsFeed[i].comments_count});
            </a>
        </li>
   `);
}
    template = template.replace('{{__news_feed__}}', newsList.join(''));
    template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage -1 : 1);;
    template = template.replace('{{__next_page__}}', store.currentPage + 1);
    container.innerHTML = template;
};

function newsDetail() {

        //location - 브라우저 기본 제공 객체. 해시라는 객체를 쉽게 찾을 수 있음
        //콘솔로 location.hash하면 #id 값이 나타나는데 #은 필요 없으므로 substr()을 이용해서 필요없는 값을 자르고 이욤
        // substr() 0부터 시작. 입력한 순서부터 뒤의 내용을 띄어줌. 1입력시 0값 잘라버림
        const id = location.hash.substr(7);
        console.log(location.hash);
        //replace()를 이용해 CONTENT_URL의 @id 값을 const id 값으로 변경
        const newsContent = getData(CONTENT_URL.replace('@id',id));
        container.innerHTML = `
            <h1>${newsContent.title}</h1>
            <div>
                <a href='#/page/${store.currentPage}'>목록으로</a>
            </div>
        `;
};


function router() {
    const routePath = location.hash;
    if(routePath === '') {
        newsFeed();
        //routePath에 #/page/라는 값이 있으면 0 이상의 위치값 리턴. 없으면 -1 리턴 즉 값이 있으면 hashchange가 발생
    } else if(routePath.indexOf('#/page/') >= 0 ) {
        store.currentPage = Number(routePath.substr(7));
        newsFeed();
    } else {
        newsDetail();
    }
}
//#(hash)값에 따라 원하는 목록을 보여줘야 하므로 router 호출 
window.addEventListener('hashchange', router);

router();