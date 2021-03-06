import { Blaze } from 'meteor/blaze'
import { Tracker } from 'meteor/tracker'
import { checkboxes_recall } from '/imports/functions/checkboxes_recall.js'

Template.dishes_summary.onRendered(function(){
  $('.modal').modal({
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '4%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
    ready: function() {}, // Callback for Modal open. Modal and trigger parameters available
    complete: function() {
    $(".overlay").remove();
    } // Callback for Modal close
  });
  $('.tooltipped').tooltip({delay: 500});
});

Template.dishes_summary.events({
  'click #btn_add_dish': function() {
    event.preventDefault()

    Session.keys = {};

    if (Blaze.getView($("#add_dish_modal_content")[0])._templateInstance.lastNode.children.length > 1) {
      $('.create_dishes_form_container').remove();
    };
    Blaze.render(Template.create_dishes_form,$("#add_dish_modal_content")[0]);
    $(".create_dish_submit_btn").hide()
    $(".update_dish_submit_btn").hide()
  },

  'click .btn_edit_dish': function(event,template) {
    event.preventDefault()
    // Check if a create dish form existed in the modal
    if (Blaze.getView($("#edit_dish_modal_content")[0])._templateInstance.lastNode.children.length > 1) {
      $('.create_dishes_form_container').remove();
    };

    var selected_dishes = Session.get('selected_dishes_id');

    //Validation of dish selection checkbox
    if (!selected_dishes || selected_dishes.length === 0) {
      Materialize.toast("Please select a dish you'd like to edit", 4000);
      return false;
    } else if (selected_dishes.length > 1 )  {
      Materialize.toast("Ops! You can't choose more than 1 dish to edit, please try again", 4000);
      return false;
    } else {
      var selected_dishes = Session.get('selected_dishes_id');
      var get_dish = Dishes.findOne({_id: selected_dishes[0]});

      // Below parameters will be passed to create_dishes_form template using Blaze.renderWithData
      var get_dish_contents = {
        dish_name: get_dish.dish_name,
        dish_description: get_dish.dish_description,
        serving_option: get_dish.serving_option,
        cooking_time: get_dish.cooking_time,
        dish_cost: get_dish.dish_cost,
        dish_selling_price: get_dish.dish_selling_price,
      };
      Blaze.renderWithData(Template.create_dishes_form, get_dish_contents,$("#edit_dish_modal_content")[0]);
      $(".create_dish_submit_btn").hide()
      $(".update_dish_submit_btn").hide()
      Tracker.autorun(function(){
        if (get_dish.image_id) {
          var dish_image = Images.findOne({_id:get_dish.image_id});
          var dish_image_url = "/dishes_upload/" + dish_image._id + dish_image.extensionWithDot;
          $('.circle_base').css("background-image", "url("+dish_image_url+")");
          $('.image_upload').hide();
        }
      });
      // After template is rendered, tick the right checkboxes
      checkboxes_recall(get_dish.serving_option);
      checkboxes_recall(get_dish.allergy_tags);
      checkboxes_recall(get_dish.dietary_tags);
      checkboxes_recall(get_dish.cuisines_tags);
      checkboxes_recall(get_dish.proteins_tags);
      checkboxes_recall(get_dish.categories_tags);
      checkboxes_recall(get_dish.cooking_methods_tags);
      checkboxes_recall(get_dish.tastes_tags);
      checkboxes_recall(get_dish.textures_tags);
      checkboxes_recall(get_dish.vegetables_tags);
      checkboxes_recall(get_dish.condiments_tags);
      checkboxes_recall(get_dish.serving_temperature_tags);
      // Store all the values in Sessions
      Session.set('selected_dishes_id',get_dish._id);
      Session.set('image_id',get_dish.image_id);
      Session.set('serving_option_tags',get_dish.serving_option);
      Session.set('allergy_tags',get_dish.allergy_tags);
      Session.set('dietary_tags',get_dish.dietary_tags);
      Session.set('cuisines_tags',get_dish.cuisines_tags);
      Session.set('proteins_tags',get_dish.proteins_tags);
      Session.set('categories_tags',get_dish.categories_tags);
      Session.set('cooking_methods_tags',get_dish.cooking_methods_tags);
      Session.set('tastes_tags',get_dish.tastes_tags);
      Session.set('textures_tags',get_dish.textures_tags);
      Session.set('vegetables_tags',get_dish.vegetables_tags);
      Session.set('condiments_tags',get_dish.condiments_tags);
      Session.set('serving_temperature_tags',get_dish.serving_temperature_tags);
    }
  },

  'click #btn_delete_dish': function(event) {
    event.preventDefault();
    var selected_dishes = Session.get('selected_dishes_id');
    if (!selected_dishes || selected_dishes.length === 0) {
      Materialize.toast("Please select a dish you'd like to delete", 4000);
    } else {
      for (i = 0; i < selected_dishes.length; i++) {
        var dish_details = Dishes.findOne({_id: selected_dishes[i]});
        if (dish_details.image_id) {
          Meteor.call('dish_image.remove',dish_details.image_id);
        }
        var delete_message = dish_details.dish_name + " deleted";
        Materialize.toast(delete_message, 3000);
        Meteor.call('dish.remove', selected_dishes[i]);
      }
      Session.set('selected_dishes_id',"");
    }
  },

  'click .modal-close': function() {
    $('.modal-content').scrollTop(0);
    $('.modal-overlay').remove();
    var checkboxes = document.getElementsByClassName("dishes_checkbox");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    };
  },
  'click #modal_add_btn': function() {
    $('.modal-content').scrollTop(0);
    $('.create_dish_submit_btn').click();
    var checkboxes = document.getElementsByClassName("dishes_checkbox");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    };
  },
  'click #modal_update_btn': function() {
    $('.modal-content').scrollTop(0);
    $('.update_dish_submit_btn').click();
    var checkboxes = document.getElementsByClassName("dishes_checkbox");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    };
  }
});
