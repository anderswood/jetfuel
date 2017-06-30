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
              appendLink(link.link_title, link.short_link, link.click_count, linkAddButton);
            }
          })
        })
      })
    })
}

const appendLink = (newTitle, shortLink, clickCount, thisLocale) => {
  let linksContainer = $(thisLocale).closest('.form-sort-container').siblings('.links-container');

  linksContainer.append(
    `<div class='link-container'>
      <h4 class='link-title'>${newTitle}</h4>
      <h4 class='link-url'><a class='link-url-href' href='${shortLink}'>${shortLink}</a></h4>
      <h5 class='link-clicks'>${clickCount}</h5>
    </div>`
  )
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

const sortLinks = (links, linksContainer, linkAddButton, sortType) => {
  sortType === 'created_at'
    ? links.sort( (a,b) => a[sortType] > b[sortType]).reverse()
    : links.sort( (a,b) => a[sortType] - b[sortType]).reverse();
  linksContainer.children().remove();
  links.forEach( link => appendLink(link.link_title, link.short_link, link.click_count, linkAddButton));
}

const appendTopic = (newTopicText, id) => {
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
            <h4>Sort</h4>
            <div class='radio-btns'>
              <label class='radio-label'>
                <h5>Recently Added</h5>
                <input class='radio-added radio-btn' id='${id}' value='created_at' type='radio' name='sort${id}' checked>
              </label>
              <label class='radio-label'>
                <h5 class='most-pop-text'>Most Popular</h5>
                <input class='radio-popular radio-btn' id='${id}'  value='click_count' type='radio' name='sort${id}'>
              </label>
            </div>
          </div>
        </div>
        <div class='links-container'></div>
      </section>
    </article>`)
}
