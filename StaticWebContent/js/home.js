$(function() {
	$("#browsefile").change(function() {
		readURL(this);
		renderTemplate();
	});
	$("#gallery_img0").click(function(event) {
		setPicture(this);
		renderTemplate(rsp1.Results.Labels);

	});

	$("#gallery_img1").click(function() {
		setPicture(this);
		renderTemplate(rsp2.Results.Labels);
	});
	$("#gallery_img2").click(function() {
		setPicture(this);
		renderTemplate(rsp3.Results.Labels);
	});

})

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function(e) {
			$('#imgGrid').attr('src', e.target.result);
		};

		reader.readAsDataURL(input.files[0]);

	}
}

function setPicture(imgId) {
	var url = $(imgId).attr("src");
	$("#imgGrid").attr("src", url);
}

function renderTemplate(jsonrsp) {

	var template = $("#result-panel-template").html();
	Mustache.parse(template);
	var rendered = Mustache.render(template, jsonrsp);
	$('#result-panel').html(rendered);

}

// -------------------------Ajax--------------------

function ajaxUpload(formEle, callback) {
	var formData = new FormData(formEle);
	$
			.ajax({
				type : 'POST',
				url : 'https://p81v4825wl.execute-api.us-east-1.amazonaws.com/prod/upload',
				data : formData,
				contentType : false,
				processData : false,
				success : function(data) {
					callback && callback(data);
				},
				error : function(err) {
					console.log(err);
					callback && callback();
				}
			});
}
function ajaxGetLabels(imageFileName, callback) {
	$
			.ajax({
				type : 'GET',
				url : 'https://p81v4825wl.execute-api.us-east-1.amazonaws.com/prod/labelled-result?filename='
						+ imageFileName,
				success : function(data) {
					callback && callback(data);
				},
				error : function(err) {
					console.log(err);
					callback && callback();
				}
			});
}

function loadResult(imageFileName) {
	ajaxGetLabels(imageFileName, function(data) {
		$('#loadingSpinner').hide();
		renderTemplate(data.Results.Labels)
	});
}

$(document).ready(function() {
	$('.custom-file-input').on('change', function() {
		var alertEle = $('.alert');
		var submitBtnEle = $('#submitBtn');
		alertEle.hide();
		submitBtnEle.prop('disabled', false);

		var fileDetails = $(this)[0].files[0];
		console.log(fileDetails);
		// replace the "Choose a file" label
		$(this).next('.custom-file-label').text(fileDetails.name);
		if (fileDetails.size > 5242880) {
			alertEle.show();
			submitBtnEle.prop('disabled', true);
		}
	});

	var formEle = $('#uploadForm');

	formEle.submit(function(event) {
		event.preventDefault();
		$('#loadingSpinner').show();
		console.log(formEle);
		// console.log(formEle[0]);
		ajaxUpload(formEle[0], function(data) {
			if (data) {
				console.log(data);
				setTimeout(function() {
					loadResult(data.imageFile);
				}, 1500);
			}
		});
	})
});
