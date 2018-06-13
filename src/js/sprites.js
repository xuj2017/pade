$('#header_nav>li:eq(0)').addClass('active');

$('#csspre').each(function(i, block) {
    hljs.highlightBlock(block);
  });

$('#sprites_list').on('focus', '.icon_code', function(){
  $(this).select();
})