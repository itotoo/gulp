alert(123);

var Cee = {
	init : function() {
		this.bindEvents();
		this.loadData();
		
		if($('.j-class').index() == 0) {
			$('input[name="isSchool"]').val(0);
			$('input[name="classId"]').val($('#jSubScope .crt-on').data('id'));
		} else if($('.j-school').index() == 0) {
			$('input[name="isSchool"]').val(1);
		}
		
		var stdSwiper = new Swiper(".swiper-container",{
			slidesPerView: "auto",
			width : '1.26rem',
			spaceBetween: 5
		});
	},
	
	loadData : function() {
		/*if($('#jDropload').find('#jSummaryList').length == 0) {
			$('#jDropload').html('<div class="c-notelist" id="jSummaryList"></div>');
		}*/
		$('#jDropload').page({
		    url : '/activity/ceeOathListData.htm',
		    curPage: 1,
		    pageSize : $('#jPageSize').val(),
		    form: document.querySelector('#formId'),
		    scrollCont: document.querySelector('#jData'),
		    loadTips : '',
		    callbackPullDown: function(datas) {
		    	datas.showLikesCount = function() {
					return this.likesCount > 0;
				}
				var content = Mustache.render($('#jDataTpl').html(), datas);
				$('#jData').append(content);
		    }
		});
	},
	
	bindEvents : function() {
		var _this = this;
		//change
		$('#jScope').on('click', 'li', function(e) {
			var $target = $(e.target);
			$target.addClass('on').siblings().removeClass('on');
			$('input[name="isSchool"]').val('');
			$('input[name="schoolId"]').val('');
			$('input[name="classId"]').val('');
			$('input[name="userId"]').val('');
			
			var isChild = $('#jSubScope').data('child');
			
			if($target.hasClass('j-leke')) {
				$('#jSubScope').hide();
			} else if($target.hasClass('j-school')) {
				$('input[name="isSchool"]').val(1);
				
				if(isChild) {
					$('input[name="userId"]').val($('#jSubScope .crt-on').data('id'));
				} else {
					$('input[name="schoolId"]').val($target.data('id'));
				}
				$('#jSubScope').show();
			} else if($target.hasClass('j-class')) {
				$('input[name="isSchool"]').val(0);
				if(!isChild) {
					$('input[name="classId"]').val($('#jSubScope .crt-on').data('id'));
				} else {
					$('input[name="userId"]').val($('#jSubScope .crt-on').data('id'));
				}
				
				$('#jSubScope').show();
			}
			
			_this.loadData();
		});
		
		$('#jSubScope').on('click', 'li', function(e) {
			var $target = $(e.target);
			$target.addClass('crt-on').siblings().removeClass('crt-on');
			var isChild = $('#jSubScope').data('child');
			var id = $target.data('id');
			if(isChild) {
				$('input[name="userId"]').val(id);
			} else {
				$('input[name="classId"]').val(id);
			}
			
			_this.loadData();
		});
		
		//submit
		$('#jCeeSubmit').on('click', function() {
			var content = $('#jContent').val();
			if(!$.trim(content)) {
				Utils.Notice.print('鍐呭涓嶈兘涓虹┖', 3000);
				return ;
			} else if(content.length > 200) {
				Utils.Notice.print('鍐呭璇烽檺鍒跺湪200瀛椾互鍐�', 3000);
				return ;
			}
			$.ajax({
				type : 'post',
				url : Leke.ctx + '/auth/common/activity/addCeeOath.htm',
				data : {
					content : content
				},
				dataType : 'json',
				success : function(json) {
					if(json.success) {
						$('#jContent').next().remove();
						$('#jContent').remove();
						
						var data = {
							content : content,
							userName : json.datas.userName,
							photo : json.datas.photo
						}
						
						$('.mobile-leke-manifesto .ipt-warp').first().remove();
						$('.mobile-leke-manifesto').addClass('std-manifesto').prepend(Mustache.render($('#jCeeTpl').html(), data));
					}
				}
			});
		});
		//likes
		$('.mobile-leke-manifesto').on('click', '.j-likes', function(e) {
			var $target = $(e.target);
			var id = $target.data('id');
			if(id) {
				$.ajax({
					type : 'post',
					url : Leke.ctx + '/auth/common/activity/ceeAddLikes.htm',
					data : {id : id},
					dataType : 'json',
					success : function(json) {
						if(json.success) {
							$target.toggleClass('on');
							var count = $target.text();
							if($target.hasClass('on')) {
								if(count == 0) {
									$target.html('1');
								} else {
									$target.text(parseInt(count) + 1);
								}
							} else {
								if(count == 1) {
									$target.html('');
								} else {
									$target.text(parseInt(count) - 1);
								}
							}
						}
					}
				});
			}
		});
	}
};

Cee.init();