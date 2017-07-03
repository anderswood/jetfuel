
const getContent = () => {
  $.get('/api/v1/links')
    .then(links => {
      $.get('/api/v1/topics').then(topics => {
        topics.forEach(topic => {
          appendTopic(topic.name, topic.id)
          let linkAddButton = $(`button[id='${topic.id}']`)

          $(linkAddButton).closest('.card-body').addClass('card-body-hide');
          links.forEach(link => {
            if (topic.id === link.topic_id) {
              appendLink(link, linkAddButton);
            }
          })
        })
      })
    })
}

const encode = (num) => {
  const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
  const base = alphabet.length;
  let encoded = '';

  while (num) {
    let remainder = num % base;

    num = Math.floor(num / base);
    encoded = alphabet[remainder].toString() + encoded;
  }
  return encoded;
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createShortUrl = () => {
  let randomNum = getRandomInt(1, 100000000)
  let code = encode(randomNum)

  return `jet.fuel/${code}`
}

const sortLinks = (links, linksContainer, linkAddButton, sortType, sortAscendStatus) => {
    switch(sortType+'_'+sortAscendStatus) {
      case 'created_at_true':
        links.sort( (a,b) => a[sortType] > b[sortType]).reverse()
        break;
      case 'created_at_false':
        links.sort( (a,b) => a[sortType] > b[sortType])
        break;
      case 'click_count_true':
        links.sort( (a,b) => a[sortType] - b[sortType]).reverse()
        break;
      case 'click_count_false':
        links.sort( (a,b) => a[sortType] - b[sortType])
        break;
    }

  linksContainer.children().remove();
  links.forEach( link => appendLink(link, linkAddButton));
}

const addSortSVG = () => {
  return (
    `
    <label class='sort-label'>
      <svg class='sort-svg' fill="#FFF" width='24' height'24' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g><path d="M10.7003505,9.06802037 L8.78600431,9.06802037 L8.78600431,18.6999998 L5.91406855,18.6999998 L5.91406855,9.06802037 L4,9.06802037 L7.35003643,5 L10.7003505,9.06802037 Z M19.5002349,5.37759403 L19.4991243,8.76566751 L12.0591337,8.76566751 L9.26854727,5.37648346 L19.5002349,5.37759403 Z M16.3950793,13.7326948 L10.0279,13.7326948 L10.0279,10.3435108 L16.3961898,10.3446214 L16.3950793,13.7326948 Z M13.910455,18.6999998 L10.0279,18.6999998 L10.0279,15.3108158 L13.9126762,15.3108158 L13.910455,18.6999998 Z"></path></g></g>
      </svg>
    </label>
    `
  )
}

const appendTopic = (newTopicText, id, active = '') => {
  $('#content-container').append(
    `<article class='topic-card'>
      <header class='topic-title'>
        <h3 class='topic-text'>${newTopicText}</h3>
        <h3 class='link-qty'></h3>
      </header>
      <section class='card-body'>
        <div class='form-sort-container'>
          <div class='add-form'>
            <div class='form-container'>
              <div class='title-container'>
                <label class='title-label'><h5>Title</h5></label>
                <input class='title-input link-inputs' placeholder='title'>
              </div>
              <div class='url-container'>
                <label class='url-label'><h5 class='url-text'>Url</h5></label>
                <input class='url-input link-inputs' placeholder='url'>
              </div>
            </div>
            <button id=${id} class='link-add-btn'><h5>Add</h5></button>
          </div>
          <div class='sort-options'>
            <div class='sort-btn sort-btn-added sort-ascend sort-active' id='${id}' value='created_at'>
              <h5>Recently Added</h5>
              ${addSortSVG()}
            </div>
            <div class='sort-btn sort-btn-popular sort-ascend' id='${id}' value='click_count'>
              <h5>Most Popular</h5>
              ${addSortSVG()}
            </div>
          </div>
        </div>
        <div class='links-container'></div>
      </section>
    </article>`)
}

const appendLink = (linkObj, thisLocale) => {
  let linksContainer = $(thisLocale).closest('.form-sort-container').siblings('.links-container');
  const linkCreateDate = moment(linkObj.created_at).format('MMMM Do YYYY, h:mm:ss a');

  linksContainer.append(
    `<div class='link-container'>
      <div class='title-url-container'>
        <h4 class='link-title'>${linkObj.link_title}</h4>
        <h4 class='link-url'>
          <a class='link-url-href' href='${linkObj.short_link}'>${linkObj.short_link}</a>
        </h4>
      </div>
      <div class='date-count-container'>
        <h5 class='link-created-date'>${linkCreateDate}</h5>
        <h5 class='link-clicks'>${linkObj.click_count}</h5>
      </div>
    </div>`
)
}

const urlValidation = (userURL) => {

  if (userURL.includes('http://www.') || userURL.includes('https://www.')) {
    return userURL
  } else if (userURL.includes('www.')) {
    return `https://${userURL}`
  } else if (userURL.includes('http') || userURL.includes('https') && !userURL.includes('www')) {
    return userURL
  } else if (!userURL.includes('http://www.') || !userURL.includes('https://www.'))  {
    return `https://www.${userURL}`
  } else {
    return userURL
  }
}

const validUrlCheck = (userInput) => {
  let res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);

  if (res === null) {
    return false;
  } else {
    return true;
  }
}

const userInputValidation = (userInput) => {
  let userUrl = urlValidation(userInput)
  let longLinkCheck = validUrlCheck(userUrl)

  if (longLinkCheck) {
    return userUrl
  } else {
    alert('Invalid URL format, please enter the URL with an "https:// prefix">')
  }
}
