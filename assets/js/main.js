
(function($) {

	var	$window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Hack: Enable IE flexbox workarounds.
		if (browser.name == 'ie')
			$body.addClass('is-ie');

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Forms.

		// Hack: Activate non-input submits.
			$('form').on('click', '.submit', function(event) {

				// Stop propagation, default.
					event.stopPropagation();
					event.preventDefault();
					var name = $('#name').val()
					if(name.length == 0){
						$('#nameErr').remove()
						$('#name').after('<div style="color:red;" id="nameErr">Name is Required</div>');
					}else{
						$('#nameErr').remove()
					}
					var email = $('#email').val()
					if(email.length == 0){
						$('#emailErr').remove()
						$('#email').after('<div style="color:red;" id="emailErr">Email is Required</div>');
					}else{
						$('#emailErr').remove()
					}
					var message = $('#message').val()
					if(message.length == 0){
						$('#messageErr').remove()
						$('#message').after('<div style="color:red;" id="messageErr">Message is Required</div>');
					}else{
						$('#messageErr').remove()
					}
					if (name.length != 0 && email.length != 0 && message.length != 0){
						var data = {}
						data['name'] = name
						data['email'] = email
						data['message'] = message
						var formBtn = document.getElementById("formBtn")
						formBtn.disabled = true
						var url = 'https://script.google.com/macros/s/AKfycbw5mFmjF4hWj4p9RcWKeIhDGjq7zfRbv0bl6leTBxKEkdLtC0QgJ3lHR7ix_dJ8qGNcsw/exec';
						var xhr = new XMLHttpRequest();
						xhr.open('POST', url);
						// xhr.withCredentials = true;
						xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
						xhr.onreadystatechange = function() {
							if (xhr.readyState === 4 && xhr.status === 200) {
								// console.log(data)
								var snackbar = document.getElementById("snackbar")
								snackbar.className = "show";
								setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 5000);
								formBtn.disabled = false
								$('#resForm')[0].reset();
							}
							// else{
							// 	var failSnackbar = document.getElementById("failSnackbar")
							// 	failSnackbar.className = "failShow";
							// 	$('#resForm')[0].reset();
							// 	setTimeout(function(){ failSnackbar.className = failSnackbar.className.replace("failShow", ""); }, 5000);
							// }
						};
						var encoded = Object.keys(data).map(function(k) {
								return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
							}).join('&');
							xhr.send(encoded);
						}
						// Submit form.
						// form.submit();
			});

	// Sidebar.
		if ($sidebar.length > 0) {

			var $sidebar_a = $sidebar.find('a');

			$sidebar_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
						if ($this.attr('href').charAt(0) != '#')
							return;

					// Deactivate all links.
						$sidebar_a.removeClass('active');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
						if ($section.length < 1)
							return;

					// Scrollex.
						$section.scrollex({
							mode: 'middle',
							top: '-20vh',
							bottom: '-20vh',
							initialize: function() {

								// Deactivate section.
									$section.addClass('inactive');

							},
							enter: function() {

								// Activate section.
									$section.removeClass('inactive');

								// No locked links? Deactivate all links and activate this section's one.
									if ($sidebar_a.filter('.active-locked').length == 0) {

										$sidebar_a.removeClass('active');
										$this.addClass('active');

									}

								// Otherwise, if this section's link is the one that's locked, unlock it.
									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		}

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				// If <=large, >small, and sidebar is present, use its height as the offset.
					if (breakpoints.active('<=large')
					&&	!breakpoints.active('<=small')
					&&	$sidebar.length > 0)
						return $sidebar.height();

				return 0;

			}
		});

	// Spotlights.
		$('.spotlights > section')
			.scrollex({
				mode: 'middle',
				top: '-10vh',
				bottom: '-10vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			})
			.each(function() {

				var	$this = $(this),
					$image = $this.find('.image'),
					$img = $image.find('img'),
					x;

				// Assign image.
					$image.css('background-image', 'url(' + $img.attr('src') + ')');

				// Set background position.
					if (x = $img.data('position'))
						$image.css('background-position', x);

				// Hide <img>.
					$img.hide();

			});

	// Features.
		$('.features')
			.scrollex({
				mode: 'middle',
				top: '-20vh',
				bottom: '-20vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			});

})(jQuery);