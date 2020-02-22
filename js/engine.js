//check first run
var window_now = "active";
var last_choice = "";

$(document).ready(function() {
  $('.modal').modal();
  if (localStorage.getItem('already_used') == null) {
    $("#modal1").modal('open');

    var subjects = []
    var subj_content = []
    var arc_subjects = []
    var arc_subj_content = []

    localStorage.setItem("subjects", JSON.stringify(subjects));
    localStorage.setItem("subj_content", JSON.stringify(subj_content));
    localStorage.setItem("arc_subjects", JSON.stringify(arc_subjects));
    localStorage.setItem("arc_subj_content", JSON.stringify(arc_subj_content));
    localStorage.setItem("already_used", "yes");
  } else {

    refresh_subj_list();

  }
});

function htmlspecialchars(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function cancelhtmlspecialchars(str){
  return str.replace(/<br \/>/g,"\n").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"\"").replace(/&#039;/g,"'").replace(/&amp;/g,"&");
}


function refresh_subj_list() {
  var detail = "";
  if (window_now == "active") {
    detail = "subjects"
  } else {
    detail = "arc_subjects"
  }

  $('#desktop_subject_list').html("");
  $('#mob_subject_list').html("");
  JSON.parse(localStorage.getItem(detail)).forEach(function(elem) {
    $('#desktop_subject_list').html($("#desktop_subject_list").html() + "<li><a class=\"waves-effect\" href=\"#!\" onclick=\"show_sj(\'" + elem + "\')\">" + elem + "</a></li>");
    $('#mob_subject_list').html($("#mob_subject_list").html() + "<li><a class=\"waves-effect\" href=\"#!\" onclick=\"show_sj(\'" + elem + "\')\">" + elem + "</a></li>");
  });
}



function change_window(win) {
  if (win == "arc") {
    window_now = "archive";
    $('#mob_section_name').text('Архив');
    $('#desktop_section_name').text('Архив');
    $('#add_subj_button').css({"display":"none"});
  } else {
    window_now = "active";
    $('#mob_section_name').text('Активное')
    $('#desktop_section_name').text('Активное')
    $('#add_subj_button').css({"display":"inline"});
  }
  $('#slide-out').sidenav('close');
  refresh_subj_list();
}

function addsubject() {
  $('#modal2').modal('open');
  $('#slide-out').sidenav('close');
}

function add_subject_now() {
  var newsubj = $('#new_subj_name').val();
  $('#new_subj_name').val("")

  if (newsubj.length > 0) {
    var subjects = JSON.parse(localStorage.getItem('subjects'));

    if (subjects.indexOf(newsubj) == -1) {
      subjects.push(newsubj);
      localStorage.setItem('subjects', JSON.stringify(subjects));
      $('#modal2').modal('close');
      refresh_subj_list();
    } else {
      $('#add_error').text("Предмет с таким названием уже существует.");
    }
  }
}


function show_sj(id) {
  last_choice = id;
  $("#sj_tasks_lines").html("");
  $('#sj_name_now').text(id);
  $('#slide-out').sidenav('close');

  var sind = -1;

  var detail = "";
  if (window_now == "active") {
    detail = "subj_content"
  } else {
    detail = "arc_subj_content"
  }

  if (JSON.parse(localStorage.getItem(detail)) != "") {
    JSON.parse(localStorage.getItem(detail)).forEach(function(elem, ind) {
      if (elem[0] == id) {
        sind = ind;
      }
    });

    var color = "";
    var status_word = "";

    if (window_now == "active"){
      if (sind != -1) {
        for (item = JSON.parse(localStorage.getItem(detail))[sind].length-1; item >= 1; item--) {
          if (JSON.parse(localStorage.getItem(detail))[sind][item][1] == 0){color = "black-text"; status_word="";}else{color = "grey lighten-2 grey-text";status_word="<span class='green-text'>Выполнено!</span><br>"}
          $("#sj_tasks_lines").html($("#sj_tasks_lines").html() + '<li class="collection-item '+color+'"><div>'+ status_word + JSON.parse(localStorage.getItem(detail))[sind][item][0] + '<a href="#!" onclick="mark_as_done('+sind+','+item+')" class="secondary-content"><i class="material-icons green-text">assignment_turned_in</i></a><a href="#!" onclick="send_to_archive('+sind+','+item+')" class="secondary-content"><i class="material-icons yellow-text">archive</i></a><a onclick="edit_text('+sind+','+item+')" href="#!" class="secondary-content"><i class="material-icons blue-text">edit</i></a><a onclick="delete_task('+sind+','+item+')" href="#!" class="secondary-content"><i class="material-icons red-text">delete</i></a></div></li>');
        }
      }
    } else {
      if (sind != -1) {
        for (item = JSON.parse(localStorage.getItem(detail))[sind].length-1; item >= 1; item--) {
          if (JSON.parse(localStorage.getItem(detail))[sind][item][1] == 0){color = "black-text"; status_word="";}else{color = "grey lighten-2 grey-text";status_word="<span class='green-text'>Выполнено!</span><br>"}
          $("#sj_tasks_lines").html($("#sj_tasks_lines").html() + '<li class="collection-item '+color+'"><div>'+ status_word + JSON.parse(localStorage.getItem(detail))[sind][item][0] + '<a onclick="delete_task('+sind+','+item+')" href="#!" class="secondary-content"><i class="material-icons red-text">delete</i></a></div></li>');
        }
      }
    }



  }


  $('#sj_tasks').css({
    "display": "block"
  });

  $('#actions_with_subject').css({'display':'none'});

}


function open_new_task_form() {
  $('#modal3').modal('open');
}


function add_task_now() {

  var task_text = $('#new_task_text').val();
  task_text = htmlspecialchars(task_text);
  task_text = task_text.replace(/\n/g, "<br />");


  if (task_text.length > 0) {

    var sind = -1;
    var detail = "";
    if (window_now == "active") {
      detail = "subj_content"
    } else {
      detail = "arc_subj_content"
    }

    if (Array.isArray(JSON.parse(localStorage.getItem(detail)))) {
      JSON.parse(localStorage.getItem(detail)).forEach(function(elem, ind) {
        if (elem[0] == last_choice) {
          sind = ind;
        }
      });


      if (sind != -1){
        var lst = JSON.parse(localStorage.getItem(detail));
        lst[sind].push([task_text,0]);
        localStorage.setItem(detail,JSON.stringify(lst));
      } else {
        var lst = JSON.parse(localStorage.getItem(detail));
        lst.push([last_choice,[task_text,0]]);
        localStorage.setItem(detail,JSON.stringify(lst));
      }

      $('#modal3').modal('close');
    } else {
      var lst = [last_choice,[task_text,0]];
      localStorage.setItem(detail,JSON.stringify(lst));
    }

    $('#new_task_text').val("");

    show_sj(last_choice);

    M.toast({html:'Задание добавлено.'});

  }
}


function delete_task(sind,item){
  if (window_now == "active") {
    detail = "subj_content"
  } else {
    detail = "arc_subj_content"
  }
  lst = JSON.parse(localStorage.getItem(detail));

  lst[sind].splice(item,1);

  localStorage.setItem(detail,JSON.stringify(lst));

  show_sj(last_choice);

  M.toast({html:'Задание удалено.'});
}


function mark_as_done(sind,item){
  if (window_now == "active") {
    detail = "subj_content"
  } else {
    detail = "arc_subj_content"
  }
  lst = JSON.parse(localStorage.getItem(detail));

  if (lst[sind][item][1] == 1){ lst[sind][item][1] = 0 } else { lst[sind][item][1] = 1 }

  localStorage.setItem(detail,JSON.stringify(lst));

  show_sj(last_choice);

  M.toast({html:'Статус задания изменен.'});
}


function send_to_archive(sind,item){

    var actual_subj_content = JSON.parse(localStorage.getItem('subj_content'));
    var actual_arc_subjects = JSON.parse(localStorage.getItem('arc_subjects'));
    var actual_arc_subj_content = JSON.parse(localStorage.getItem('arc_subj_content'));

    if (actual_subj_content[sind][item][1] == 0){
      M.toast({html:'Нельзя отправить в архив. Задание не выполнено.'});
      return;
    }

    if (actual_arc_subjects.indexOf(actual_subj_content[sind][0]) == -1){
      actual_arc_subjects.push(actual_subj_content[sind][0]);
    }

    ind = -1;

    actual_arc_subj_content.forEach((elem, indelem) => {
      if (elem[0] == actual_subj_content[sind][0]){
        ind = indelem;
      }
    });

    if (ind == -1){
      actual_arc_subj_content.push([actual_subj_content[sind][0],[actual_subj_content[sind][item][0],actual_subj_content[sind][item][1]]]);
    } else {
      actual_arc_subj_content[ind].push([actual_subj_content[sind][item][0],actual_subj_content[sind][item][1]]);
    }

    actual_subj_content[sind].splice(item,1);

    localStorage.setItem('subj_content',JSON.stringify(actual_subj_content));
    localStorage.setItem('arc_subjects',JSON.stringify(actual_arc_subjects));
    localStorage.setItem('arc_subj_content',JSON.stringify(actual_arc_subj_content));

    show_sj(last_choice);

    M.toast({html:'Задание отправлено в архив.'});
}

var last_edit_id_sind = -1;
var last_edit_id_item = -1;

function edit_text(sind,item){
  var actual_subj_content = JSON.parse(localStorage.getItem('subj_content'));

  last_edit_id_sind = sind;
  last_edit_id_item = item;

  $('#edit_text_modal').modal('open');
  $('#edited_task_textarea').val(cancelhtmlspecialchars(actual_subj_content[sind][item][0]));
  M.textareaAutoResize($('#edited_task_textarea'));

}

function accept_edited_text(){
  var actual_subj_content = JSON.parse(localStorage.getItem('subj_content'));

  actual_subj_content[last_edit_id_sind][last_edit_id_item][0] = htmlspecialchars($('#edited_task_textarea').val()).replace(/\n/g,"<br />");
  $('#edited_task_textarea').val("");

  localStorage.setItem('subj_content',JSON.stringify(actual_subj_content));

  M.toast({html:'Запись обновлена.'});

  show_sj(last_choice);
}


document.addEventListener('contextmenu',function(e){
  e.preventDefault();
  if (last_choice != ""){$('#actions_with_subject').css({'display':'block'});}
});
