<?php

/**
 * 计算几何平均值
 * @return geometric_average(array(2,8)); //Output-> 4
 */
function geometric_average($arr) {
	$sum = 0;
	$n = count($arr);
	for ($i = 0; $i < $n; $i++) {
		$sum = $sum + log($arr[$i]);
	}

	$sum = $sum / $n;

	return exp($sum);
}

/**
 * GCYY算法
 * @param list 列表数据
 * @param gcyy_k 计算的键值
 */
function GCYY($list = array(), $gcyy_k = array()) {
	$line1 = array();
	$line2 = array();

	$max_line1_gc = 0;
	$min_line1_gc = 0;

	foreach ($list as $k => $v) {
		foreach ($gcyy_k as $vv) {
			$mean_v[$vv] = $v[$vv];
		}
		// var_dump(array_values($mean_v));exit;

		$line1[$v['db_id']]['gc'] = geometric_average(array_values($mean_v));
		if ($max_line1_gc < $line1[$v['db_id']]['gc']) {
			$max_line1_gc = $line1[$v['db_id']]['gc'];
		}
		if ($min_line1_gc > $line1[$v['db_id']]['gc'] || $min_line1_gc == 0) {
			$min_line1_gc = $line1[$v['db_id']]['gc'];
		}

		// var_dump($v, $mean_v);exit;
	}
	// var_dump($gcyy_k, $mean_v);exit;

	$line1_gc = abs(log($max_line1_gc / $min_line1_gc, 0.618));

	// var_dump($line1_gc);

	arsort($mean_v);
	$gcyy_k = array_keys($mean_v);
	function countGCYY($list, $gcyy_k, $count_k, $yu = '<', $sumgcyy = 0, $num = 0) {
		$old_list = $new_list = $list;
		// $gcyy_k = array_flip($gcyy_k);
		$gcyy = array();
		$mean_v = array();
		$max_gc = 0;
		$min_gc = 0;

		foreach ($new_list as $k => $v) {
			if ($count_k[$num]) {
				$new_list[$k][$count_k[$num]] = bcdiv(1, $v[$count_k[$num]], 12);
			}
		}

		$num = $num + 1;

		foreach ($new_list as $k => $v) {
			foreach ($gcyy_k as $kk => $vv) {
				$mean_v[$kk] = $v[$vv];
			}
			// var_dump($mean_v);exit;
			$new_list[$k]['gcyy'] = geometric_average(array_values($mean_v));

			if ($max_gc < $new_list[$k]['gcyy']) {
				$max_gc = $new_list[$k]['gcyy'];
			}
			if ($min_gc > $new_list[$k]['gcyy'] || $min_gc == 0) {
				$min_gc = $new_list[$k]['gcyy'];
			}
		}

		$new_sumgcyy = ABS(LOG($max_gc / $min_gc, 0.618));

		if ($num > count($count_k)) {
			if ($yu == '<') {
				if ($new_sumgcyy < $sumgcyy) {
					return array('list' => $new_list, 'sumgcyy' => $new_sumgcyy);
				} else {
					return array('list' => $old_list, 'sumgcyy' => $sumgcyy);
				}
			} else {
				if ($new_sumgcyy > $sumgcyy) {
					return array('list' => $new_list, 'sumgcyy' => $new_sumgcyy);
				} else {
					return array('list' => $old_list, 'sumgcyy' => $sumgcyy);
				}
			}

		}
		// var_dump($new_sumgcyy . '<' . $sumgcyy);

		if ($yu == '<') {
			if ($new_sumgcyy < $sumgcyy || $sumgcyy == 0) {
				//用新的数组
				return countGCYY($new_list, $gcyy_k, $count_k, $yu, $new_sumgcyy, $num);
			} else {
				return countGCYY($old_list, $gcyy_k, $count_k, $yu, $sumgcyy, $num);
			}
		} else {
			// if ($new_sumgcyy > $sumgcyy || $sumgcyy == 0) {
			//用新的数组
			return countGCYY($new_list, $gcyy_k, $count_k, $yu, $new_sumgcyy, $num);
			// } else {
			// return countGCYY($old_list, $gcyy_k, $count_k, $yu, $sumgcyy, $num);
			// }
		}

	}

	function forCountGCYY($list, $gcyy_k, $count_k, $yu = '<', $sumgcyy = 0) {
		$line2 = countGCYY($list, $gcyy_k, $count_k, $yu);
		$line22 = countGCYY($line2['list'], $gcyy_k, $count_k, $yu);
		// var_dump($line2['sumgcyy'], $line22['sumgcyy']);exit;

		//
		if ($line2['sumgcyy'] > $line22['sumgcyy']) {
			// $line22 = countGCYY($line22['list'], $gcyy_k);

			if ($sumgcyy == $line22['sumgcyy']) {
				return $line22;
			}
			return forCountGCYY($line22['list'], $gcyy_k, $count_k, $yu, $line22['sumgcyy']);

		} else {
			return $line2;
		}
	}

	$line2 = forCountGCYY($list, $gcyy_k, $gcyy_k, '<');
	// var_dump($line2);exit;

	$line3 = array();
	$line3_val = array();
	$line3_gc = array();
	foreach ($line2['list'] as $k => $v) {
		foreach ($v as $kk => $vv) {
			if (array_search($kk, $gcyy_k) !== false) {
				$line3[$k][$kk] = $vv / $v['gcyy'];

				$line3_val[$kk][$v['db_id']] = $line3[$k][$kk];
			} else {
				$line3[$k][$kk] = $vv;
			}
		}
	}

	foreach ($line3_val as $k => $v) {
		$line3_gc[$k] = geometric_average(array_values($v));
	}

	// var_dump($line3_gc, $line3_val);

	$line4 = array();
	$line4_FL = array();
	$count_k = array();

	foreach ($line3_val as $k => $v) {
		foreach ($v as $kk => $vv) {
			$line4[$k][] = $vv / $line3_gc[$k];
		}
	}
	foreach ($line4 as $k => $v) {
		$line4_FL[$k] = current($v) / end($v);
		if ($line4_FL[$k] < 1) {
			$count_k[$k] = $mean_v[$k];
		}
	}
	// var_dump($line4);
	// var_dump($line4_FL);
	asort($count_k);
	$count_k = array_keys($count_k);
	// var_dump($count_k);
	$line5 = countGCYY($line2['list'], $gcyy_k, $count_k, '>');
	return $line5;
}

//GCYY算法
// $r = array(
// 	array(1,2,3,4,5,6,7),
// 	array(1,2,3,4,5,6,7),
// 	array(1,2,3,4,5,6,7),
// 	array(1,2,3,4,5,6,7),
// 	array(1,200,3,4,500,6,7),
// 	array(1,2,3,4,5,6,7),
// );
// $line5 = GCYY($r, array(1, 2, 3, 4));
// $max = 0;
// $min = 100;
// foreach ($line5['list'] as $k => $v) {
// 	if ($v['gcyy'] < $min) {
// 		$min = $v['gcyy'];
// 		$arr[0] = $v;
// 	}
// 	if ($v['gcyy'] > $max) {
// 		$max = $v['gcyy'];
// 		$arr[1] = $v;
// 	}

// }
// var_dump($arr, $line5['list']);
// exit;