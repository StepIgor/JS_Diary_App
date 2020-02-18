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
  } else {
    window_now = "active";
    $('#mob_section_name').text('Активное')
    $('#desktop_section_name').text('Активное')
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

    if (sind != -1) {
      for (item = 1; item < JSON.parse(localStorage.getItem(detail))[sind].length; item++) {
        $("#sj_tasks_lines").html($("#sj_tasks_lines").html() + '<a href="#!" class="collection-item black-text">' + JSON.parse(localStorage.getItem(detail))[sind][item][0] + '</a>');
      }
    }

  }


  $('#sj_tasks').css({
    "display": "block"
  });
}


function open_new_task_form() {
  $('#modal3').modal('open');
}


function add_task_now() {
  var task_text = $('#new_task_text').val();

  if (task_text.length > 0) {

    var sind = -1;
    var detail = "";
    if (window_now == "active") {
      detail = "subj_content"
    } else {
      detail = "arc_subj_content"
    }

    if (JSON.parse(localStorage.getItem(detail)) != "") {
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

  }
}
