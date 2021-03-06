Template.chef_avatar.helpers({
  'chef_avatar': function () {
    var returned_dish_id = Session.get('dish_id');
    var get_dish_details = Dishes.findOne({"_id":returned_dish_id});
    var get_dish_creator = get_dish_details && get_dish_details.user_id;
    var get_profile_images = profile_images.findOne({'userId': get_dish_creator});
    var get_profile_images_id = get_profile_images && get_profile_images._id;
    var get_profile_images_ext = get_profile_images && get_profile_images.extensionWithDot;
    var get_profile_images_name = get_profile_images_id + get_profile_images_ext;
    return get_profile_images_name;
  }
});
