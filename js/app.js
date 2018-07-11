/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {

    var attendance = JSON.parse(localStorage.attendance);
        

    var days = attendance[Object.keys(attendance)[0]].length;
    var students = Object.keys(attendance);

    renderDays();
    renderStudents();

    // renderday row based on days variable
    function renderDays() {
        // render days
        for(let i=1; i<=days;i++) {
            let dayTh = document.createElement("th");
            dayTh.innerText = i;
            $('.missed-col').before(dayTh);
        }
    }

    function renderStudents() {
        for (student of students) {
            // create student tr
            let studentTr = document.createElement("tr");
            studentTr.classList.add('student');
            
            // create student names
            let nameTd = document.createElement("td");
            nameTd.classList.add('name-col');
            nameTd.innerText = student;

            //append student name into student tr
            studentTr.append(nameTd);

            // Create checkboxes
            for (let i=1;i<=days;i++) {
                let checkboxTd = document.createElement("td");
                checkboxTd.classList.add("attend-col");
                checkboxTd.innerHTML = "<input type='checkbox'>"
                studentTr.append(checkboxTd);
            }
            

            //Create missed-col
            let missedCol = document.createElement("td");
            missedCol.classList.add("missed-col");
            missedCol.innerText="0"; 

            studentTr.append(missedCol);

            // append student tr into tbody
            $('tbody').append(studentTr);
        }
    }

    let $allMissed = $('tbody .missed-col'),
    $allCheckboxes = $('tbody input');
    


    // Count a student's missed days
    function countMissing() {
        $allMissed.each(function() {
            var studentRow = $(this).parent('tr'),
                dayChecks = $(studentRow).children('td').children('input'),
                numMissed = 0;

            dayChecks.each(function() {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
        });
    }

    // Check boxes, based on attendace records
    $.each(attendance, function(name, days) {
        var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
            dayChecks = $(studentRow).children('.attend-col').children('input');

        dayChecks.each(function(i) {
            $(this).prop('checked', days[i]);
        });
    });

    // When a checkbox is clicked, update localStorage
    $allCheckboxes.on('click', function() {
        var studentRows = $('tbody .student'),
            newAttendance = {};

        studentRows.each(function() {
            var name = $(this).children('.name-col').text(),
                $allCheckboxes = $(this).children('td').children('input');

            newAttendance[name] = [];

            $allCheckboxes.each(function() {
                newAttendance[name].push($(this).prop('checked'));
            });
        });

        countMissing();
        localStorage.attendance = JSON.stringify(newAttendance);
    });

    countMissing();
}());
