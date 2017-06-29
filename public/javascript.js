
getContent()

$('#add-btn-div').on('click', () => {
  //POST new topic to the server
  let newTopic = $('#topic-input').val();

  $.post('/api/v1/topics/', { name: newTopic }, (res, text, resObj) => {
    if (resObj.status === 201) {
      appendTopic(newTopic, res.id)

    } else if (resObj.status === 422) {
      //function needed to toggle on display error message
      alert('invalid entry')
    }
  })
    .catch(error => console.log(error))
})

$('#content-container').on('click', '.link-add-btn', function() {
  //POST a new link to the specific topic
  //will need variable for topic id that will be used as query parameter
  let linkTitle = $(this).siblings('.form-container').find('.title-input').val();
  let longLink = $(this).siblings('.form-container').find('.url-input').val();
  let topicId = $(this).attr('id');
  let bodyObj = {
    link_title: linkTitle,
    long_link: longLink,
    short_link: 'shorty',
    click_count: 0,
    topic_id: topicId
  };

  $.post('/api/v1/links/', bodyObj, (res, text, resObj) => {
    if (resObj.status === 201) {
      appendLink(linkTitle, 'shortLink', this)
    } else if (resp.status === 422) {
      alert('invalid link entry')
    }
  })
  .catch(error => console.log(error))
})

$('#content-container').on('click', '.topic-title', function() {
  let cardBody = $(this).siblings('.card-body')

  cardBody.toggleClass('card-body-hide')
})

function appendLink(newTitle, shortLink, thisLocale) {
  let linksContainer = $(thisLocale).closest('.form-sort-container').siblings('.links-container');

  linksContainer.append(
    //need to revisit how we structuring the links....later
    `<div class='link-container'>
      <h4 class='link-title'>${newTitle}</h4>
      <h4 class='link-url'>${shortLink}</h4>
    </div>`
  )
}

function getContent() {
  $.get('/api/v1/links')
    .then((links) => {
      $.get('/api/v1/topics').then(topics => {
        topics.forEach(topic => {
          appendTopic(topic.name, topic.id)
          let linkAddButton = $(`button[id='${topic.id}']`)

          $(linkAddButton).closest('.card-body').addClass('card-body-hide');
          links.forEach(link => {
            if (topic.id === link.topic_id) {
              appendLink(link.link_title, link.short_link, linkAddButton);
            }
          })
        })
      })
    })
}

const appendTopic = (newTopicText, id) => {
  $('#content-container').append(
    `<article class='topic-card'>
      <header class='topic-title'>
        <h3 class='topic-text'>${newTopicText}</h3>
        <h3 class='link-qty'>qty</h3>
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
                <input class='radio-added' type='radio' name='sort'>
              </label>
              <label class='radio-label'>
                <h5 class='most-pop-text'>Most Popular</h5>
                <input class='radio-popular' type='radio' name='sort'>
              </label>
            </div>
          </div>
        </div>
        <div class='links-container'></div>
      </section>
    </article>`)
}
