
getContent()

$('#add-btn-div').on('click', () => {
  let newTopic = $('#topic-input').val();

  $.post('/api/v1/topics/', { name: newTopic }, (res, text, resObj) => {
    if (resObj.status === 201) {
      appendTopic(newTopic, res.id);
      $('#topic-input').val('');
    } else if (resObj.status === 422) {
      alert('invalid entry')
    }
  })
    .catch(error => console.log(error))
})

$('#content-container').on('click', '.link-add-btn', function() {

  let linkTitle = $(this).siblings('.form-container').find('.title-input');
  let longLink = $(this).siblings('.form-container').find('.url-input');
  let validatedLongLink = userInputValidation(longLink.val())
  let shortLink = createShortUrl();
  let topicId = $(this).attr('id');
  let bodyObj = {
    link_title: linkTitle.val(),
    long_link: validatedLongLink,
    short_link: shortLink,
    click_count: 0,
    topic_id: topicId
  };

  if (validatedLongLink === 'invalid' ) {
    longLink.val('');
    return
  }

  $.post('/api/v1/links/', bodyObj, (res, text, resObj) => {
    if (resObj.status === 201) {
      appendLink(bodyObj, this)
      linkTitle.val('');
      longLink.val('');
    } else if (resp.status === 422) {
      alert('invalid link entry')
    }
  })
  .catch(error => console.log(error))
});

$('#content-container').on('click', '.topic-title', function() {
  let cardBody = $(this).siblings('.card-body')

  cardBody.toggleClass('card-body-hide')
});


$('#content-container').on('click', '.link-url', function() {
  const shortLinkText = $(this).find('a')[0].innerText;

  $.get('/api/v1/links')
    .then(links => {
      const clickedLinkObj = links.find(linkObj => linkObj.short_link === shortLinkText);
      return clickedLinkObj.click_count;
    })
    .then( clickCount => {
      $.ajax({
        method: 'PUT',
        url: '/api/v1/links/clickCountIncr',
        data: {shortLinkText, clickCount },
        success: result => {
          console.log(result.response);
        }
      })
    })

});

$('#content-container').on('click', '.sort-btn', function() {
  const topicId = $(this).attr('id');
  const sortType = $(this).attr('value');
  const linksContainer = $(this).closest('.form-sort-container').siblings('.links-container');
  const linkAddButton = $(`button[id='${topicId}']`);
  const correspondingSortBtn = $(this).siblings('.sort-btn');
  let activeStatus = $(this).hasClass('sort-active');
  let sortAscendStatus = $(this).hasClass('sort-ascend');

  if (activeStatus) {
    sortAscendStatus = !sortAscendStatus;
    $(this).toggleClass('sort-ascend');
  } else {
    $(this).toggleClass('sort-active');
    correspondingSortBtn.toggleClass('sort-active');
    activeStatus = !activeStatus;
  }

  $.get(`/api/v1/topics/${topicId}/links`)
    .then(links => {
      sortLinks(links, linksContainer, linkAddButton, sortType, sortAscendStatus)
    })
    .catch(error => console.log(error));

});
