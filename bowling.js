/**
 * Bowling reserveration javascript
 * TODO: Remove jQuery and use vanilla JS (partially done)
 */

jQuery(function(){
	window.T5CodedByKids = window.T5CodedByKids || {};
		
	jQuery.extend(true, window.T5CodedByKids, {
		init: function(){
			var self = this;			
			self.setReservedTimes(self.getToday());
			self.attachListeners();
		},
		
		attachListeners: function()
		{
			var self = this;
			
			jQuery('input[name="selected_date"]').on('change', function(){
				var date = jQuery(this).val();
				self.setReservedTimes(date);
				jQuery('fieldset[name="step2"]').removeClass('inactive').attr('disabled',false);
			});
			
			jQuery('input[type="radio"][name="starttime"]').on('change',function(){
				var time = jQuery(this).val();
				self.setLaneAvailability(time);
				jQuery('fieldset[name="step3"]').removeClass('inactive').attr('disabled',false);
			});
			
			jQuery('input[name="lane"]').on('change', function(){
				jQuery('fieldset[name="step4"]').removeClass('inactive').attr('disabled',false);
			});
			
			jQuery('button[type="submit"]').on('click', function(e){
				e.preventDefault();
				self.submitForm();
			});
			
		},
				
		disableLanes: function(){
			var self = this;
			jQuery('input[name="starttime"]').each(function(i, elem){
				if(elem.dataset['lane-1'] == 'false' && elem.dataset['lane-2'] == 'false'){
					elem.disabled = true;
				}
			});
		},
		
		disableLaneTime: function(laneValue, timeValue){
			var self = this;
			var element = jQuery('input[type="radio"][value="'+timeValue+'"]');
			element.attr('data-lane-'+laneValue, false);			
		},
		
		getToday: function(){
			var today = new Date();
			var month = today.getMonth()+1;
			if(month < 10) month = '0'+month;
			var day = today.getDate();
			if(day < 10) day = '0'+day;
			return today.getFullYear() + '-' + month + '-' + day;
		},
		
		resetForm: function(){
			var form = jQuery('form[name="reservations"]');
			form[0].reset();
		},
		
		resetLanes: function(){
			jQuery('input[name="starttime"]').each(function(i,elem){
				elem.disabled = false;
				elem.dataset['lane-1'] = true;
				elem.dataset['lane-2'] = true;
			});
		},
				
		setLaneAvailability: function(timeValue){
			var element = jQuery('input[name="starttime"][value="'+timeValue+'"]');
			var laneOneIsAvailable = element.attr('data-lane-1');
			var laneTwoIsAvailable = element.attr('data-lane-2');
			if(laneOneIsAvailable == 'false')
				document.querySelector('input[name="lane"][value="1"]').disabled = true;
			if(laneTwoIsAvailable == 'false')
				document.querySelector('input[name="lane"][value="2"]').disabled = true;
		},
		
		setReservedTimes: function(date){
			var self = this;
			self.resetLanes();
			jQuery.ajax({
				type: 'GET',
				url: 'http://scripts.americanmuscle.com/cbk/ajax.php?date='+date
			}).done(function(response){
				self.updateTimes(response);
			});
		},
		
		submitForm: function(){
			var self = this;
			var formData = JSON.stringify(jQuery('form[name="reservations"]').serializeArray());
			jQuery.ajax({
				type: 'POST',
				url: 'http://scripts.americanmuscle.com/cbk/ajax.php',
				data: formData
			}).done(function(response){
				var confirm = document.getElementById('confirmation');
				confirm.innerText = response.status;
				confirm.classList.remove('hidden');
				self.resetForm();
				document.querySelector('form[name="reservations"]').classList.add('hidden');
			});
		},
				
		updateTimes: function(times){
			var self = this;
			times['1'].forEach(function(h){
				self.disableLaneTime(1, h);
			});
			times['2'].forEach(function(h){
				self.disableLaneTime(2, h);
			});
			self.disableLanes();
		}
		
	});
	
	
	window.T5CodedByKids.init();
}); 
