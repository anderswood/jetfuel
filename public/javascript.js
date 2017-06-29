
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
  
  let linkTitle = $(this).siblings('.form-container').find('.title-input').val();
  let longLink = $(this).siblings('.form-container').find('.url-input').val();
  let shortLink = createShortUrl();
  let topicId = $(this).attr('id');
  let bodyObj = {
    link_title: linkTitle,
    long_link: longLink,
    short_link: shortLink,
    click_count: 0,
    topic_id: topicId
  };

  $.post('/api/v1/links/', bodyObj, (res, text, resObj) => {
    if (resObj.status === 201) {
      appendLink(linkTitle, bodyObj.short_link, this)
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
