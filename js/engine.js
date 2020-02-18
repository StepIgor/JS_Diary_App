//check first run
$(document).ready(function(){
  $('.modal').modal();
  if (localStorage.getItem('already_used') == null){
    $("#modal1").modal('open');

    var subjects = []
    var subj_content = []
    var arc_subjects = []
    var arc_subj_content = []

    localStorage.setItem("subjects",subjects);
    localStorage.setItem("subj_content",subj_content);
    localStorage.setItem("arc_subjects",arc_subjects);
    localStorage.setItem("arc_subj_content",arc_subj_content);
    localStorage.setItem("already_used","yes");
  }

})

var window_now = "active";

function change_window(win){
  if (win == "arc"){
    window_now = "archive";
    $('#mob_section_name').text('Архив');
    $('#desktop_section_name').text('Архив');
  } else {
    window_now = "active";
    $('#mob_section_name').text('Активное')
    $('#desktop_section_name').text('Активное')
  }
  $('#slide-out').sidenav('close');
}
